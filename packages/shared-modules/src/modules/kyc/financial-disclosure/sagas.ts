import { neuCall, put, TActionFromCreator } from "@neufund/sagas";

import { createMessage } from "../../../messages";
import { neuGetBindings } from "../../../utils";
import { coreModuleApi } from "../../core/module";
import { notificationUIModuleApi } from "../../notification-ui/module";
import { routingModuleApi } from "../../routing/module";
import { kycActions } from "../actions";
import { KycFlowMessage } from "../messages";
import { submitPersonalDataSaga } from "../sagas";

type TGlobalDependencies = unknown;

export function* submitFinancialDisclosure(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof kycActions, typeof kycActions.kycSubmitFinancialDisclosure>,
): Generator<any, void, void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    const { data, close } = action.payload;
    yield* neuCall(submitPersonalDataSaga, data);

    if (close) {
      yield put(routingModuleApi.actions.goToDashboard());
    } else {
      yield put(routingModuleApi.actions.goToKYCIndividualDocumentVerification());
    }
  } catch (e) {
    yield put(
      notificationUIModuleApi.actions.showError(
        createMessage(KycFlowMessage.KYC_PROBLEM_SENDING_DATA),
      ),
    );

    logger.error(e, "Failed to submit KYC individual data");
  }
}
