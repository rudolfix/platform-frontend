import { call, fork, put, select } from "@neufund/sagas";
import {
  EJurisdiction,
  etoModuleApi,
  kycApi,
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
import { calculateCampaignOverviewData, performLoadEtoSideEffects } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData, TReadyEtoViewData } from "../shared/types";

function* loadInvestorEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<{ jurisdiction: EJurisdiction }>,
): Generator<any, TReadyEtoViewData, any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  const userIsFullyVerified = yield select(kycApi.selectors.selectIsUserVerifiedOnBlockchain);

  yield neuCall(verifyEtoAccess, eto, userIsFullyVerified);

  const campaignOverviewData: TCampaignOverviewData = yield call(
    calculateCampaignOverviewData,
    routeMatch,
    eto,
  );

  return {
    eto,
    userIsFullyVerified,
    campaignOverviewData,
    etoViewType: EEtoViewType.ETO_VIEW_INVESTOR,
  } as const;
}

export function* loadInvestorEtoView(
  { logger }: TGlobalDependencies,
  {
    payload: { previewCode, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      etoModuleApi.sagas.loadEtoWithCompanyAndContract,
      previewCode,
    );

    yield* performLoadEtoSideEffects(eto);
    yield put(actions.bookBuilding.loadPledgeForEto(eto.etoId));

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error(e, "Could not load eto by preview code");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW),
      ),
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger }: TGlobalDependencies,
  {
    payload: { etoId, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      etoModuleApi.sagas.loadEtoWithCompanyAndContractById,
      etoId,
    );

    yield* performLoadEtoSideEffects(eto);
    yield put(actions.bookBuilding.loadPledgeForEto(eto.etoId));

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error(e, "Could not load eto");
    yield put(
      webNotificationUIModuleApi.actions.showError(
        createNotificationMessage(EtoMessage.COULD_NOT_LOAD_ETO),
      ),
    );
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewInvestorSagas(): Generator<any, void, any> {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoViewById, loadInvestorEtoViewById);
}
