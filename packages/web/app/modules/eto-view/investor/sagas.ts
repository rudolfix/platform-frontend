import { call, fork, put, select } from "@neufund/sagas";
import { match } from "react-router";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions, TActionFromCreator } from "../../actions";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { selectIsUserVerifiedOnBlockchain } from "../../kyc/selectors";
import { ensureEtoJurisdiction } from "../../routing/eto-view/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewData, performLoadEtoSideEffects } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData, TReadyEtoViewData } from "../shared/types";

function* loadInvestorEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<{ jurisdiction: EJurisdiction }>,
): Generator<any, TReadyEtoViewData, any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

  yield put(actions.eto.verifyEtoAccess(eto, userIsFullyVerified));

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
  { logger, notificationCenter }: TGlobalDependencies,
  {
    payload: { previewCode, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      previewCode,
    );

    yield* performLoadEtoSideEffects(eto);

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
    yield put(actions.etoView.watchEtoView(eto));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  {
    payload: { etoId, routeMatch },
  }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      etoId,
    );

    yield* performLoadEtoSideEffects(eto);

    const etoData = yield call(loadInvestorEtoViewInternal, eto, routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
    yield put(actions.etoView.watchEtoView(eto));
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewInvestorSagas(): Generator<any, void, any> {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoViewById, loadInvestorEtoViewById);
}
