import { call, fork, put } from "@neufund/sagas";
import {
  EJurisdiction,
  etoModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { match } from "react-router-dom";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { verifyEtoAccess } from "../../eto/sagas";
import { webNotificationUIModuleApi } from "../../notification-ui/module";
import { ensureEtoJurisdiction } from "../../routing/eto-view/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  calculateCampaignOverviewData,
  etoFlowBackwardsCompat,
  performLoadEtoSideEffects,
} from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData, TReadyEtoViewData } from "../shared/types";

function* loadNotAuthorizedEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<{ jurisdiction: EJurisdiction }>,
): Generator<any, TReadyEtoViewData, any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  yield neuCall(verifyEtoAccess, eto, false);

  const campaignOverviewData: TCampaignOverviewData = yield call(
    calculateCampaignOverviewData,
    routeMatch,
    eto,
  );

  return {
    eto,
    campaignOverviewData,
    userIsFullyVerified: false,
    etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
  } as const;
}

export function* loadNotAuthorizedEtoView(
  { logger }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      etoModuleApi.sagas.loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    yield* performLoadEtoSideEffects(eto);

    const etoData = yield call(loadNotAuthorizedEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error(e, "Could not load eto by preview code");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW),
      ),
    );
    yield put(actions.routing.goHome());
  }
}

export function* loadNotAuthorizedEtoViewById(
  { logger }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadNotAuthorizedEtoViewById>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      etoModuleApi.sagas.loadEtoWithCompanyAndContractById,
      payload.etoId,
    );
    yield* etoFlowBackwardsCompat(eto);
    const etoData = yield call(loadNotAuthorizedEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error(e, "Could not load eto by preview code");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoMessage.COULD_NOT_LOAD_ETO),
      ),
    );
    yield put(actions.routing.goHome());
  }
}

export function* etoViewNotAuthSagas(): Generator<any, void, any> {
  yield fork(neuTakeEvery, actions.etoView.loadNotAuthorizedEtoView, loadNotAuthorizedEtoView);
  yield fork(
    neuTakeEvery,
    actions.etoView.loadNotAuthorizedEtoViewById,
    loadNotAuthorizedEtoViewById,
  );
}
