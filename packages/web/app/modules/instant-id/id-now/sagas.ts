import { fork, put } from "@neufund/sagas";
import {
  coreModuleApi,
  kycApi,
  KycFlowMessage,
  neuGetBindings,
  notificationUIModuleApi,
  TKycIdNowIdentification,
} from "@neufund/shared-modules";

import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuTakeEvery } from "../../sagasUtils";

function* startIdNow(_: TGlobalDependencies): Generator<any, any, any> {
  const { apiKycService, logger } = yield* neuGetBindings({
    apiKycService: kycApi.symbols.kycApi,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const { redirectUrl }: TKycIdNowIdentification = yield apiKycService.startInstantId();

    yield put(actions.routing.openInNewWindow(redirectUrl));
    yield put(actions.instantId.setIdNowRedirectUrl(redirectUrl));

    yield put(kycApi.actions.kycLoadStatusAndData());
  } catch (e) {
    logger.error(e, "KYC instant id-now failed to start");

    yield put(
      notificationUIModuleApi.actions.showError(createMessage(KycFlowMessage.KYC_SUBMIT_FAILED)),
    );
  }
}
export function* idNowSagas(): Generator<any, any, any> {
  yield fork(neuTakeEvery, actions.instantId.startIdNowRequest, startIdNow);
}
