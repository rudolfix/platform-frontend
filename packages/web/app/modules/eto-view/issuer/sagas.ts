import { call, fork, put, select } from "@neufund/sagas";
import { DataUnavailableError } from "@neufund/shared";
import { match } from "react-router";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions, TActionFromCreator } from "../../actions";
import { loadIssuerEto } from "../../eto-flow/sagas";
import { selectIssuerEtoWithCompanyAndContract } from "../../eto-flow/selectors";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import {
  calculateCampaignOverviewData,
  calculateCampaignOverviewDataIssuerNominee,
  etoFlowBackwardsCompat,
} from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData, TReadyEtoViewData } from "../shared/types";

export function* loadIssuerPreviewEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<{ jurisdiction: EJurisdiction }>,
): Generator<any, TReadyEtoViewData, any> {
  const userIsFullyVerified = true;
  const campaignOverviewData: TCampaignOverviewData = yield call(
    calculateCampaignOverviewData,
    routeMatch,
    eto,
  );

  return {
    eto,
    campaignOverviewData,
    userIsFullyVerified,
    etoViewType: EEtoViewType.ETO_VIEW_ISSUER_PREVIEW,
  } as const;
}

export function* selectOrLoadEto(): Generator<any, TEtoWithCompanyAndContractReadonly, any> {
  let eto = yield select(selectIssuerEtoWithCompanyAndContract);
  if (eto === undefined) {
    yield neuCall(loadIssuerEto);
    eto = yield select(selectIssuerEtoWithCompanyAndContract);
  }
  return eto;
}

export function* loadIssuerEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  _: TActionFromCreator<typeof actions.etoView.loadIssuerEtoView>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly | undefined = yield call(selectOrLoadEto);

    if (eto) {
      const userIsFullyVerified = true;
      const etoViewType = EEtoViewType.ETO_VIEW_ISSUER;
      const campaignOverviewData: TCampaignOverviewData = yield call(
        calculateCampaignOverviewDataIssuerNominee,
        eto,
      );

      yield put(
        actions.etoView.setEtoViewData({
          eto,
          campaignOverviewData,
          userIsFullyVerified,
          etoViewType,
        }),
      );
      yield put(actions.etoView.watchEtoView(eto));
    } else {
      throw new Error("could not load issuer eto");
    }
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerEtoPreview(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadIssuerPreviewEtoView>,
): Generator<any, void, any> {
  yield put(actions.etoView.resetEtoViewData());
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );
    yield* etoFlowBackwardsCompat(eto);

    if (eto) {
      const etoData = yield call(loadIssuerPreviewEtoViewInternal, eto, payload.routeMatch);
      yield put(actions.etoView.setEtoViewData(etoData));
      yield put(actions.etoView.watchEtoView(eto));
    } else {
      throw new DataUnavailableError("Could not load eto");
    }
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadIssuerPreviewByIdEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadIssuerPreviewEtoViewById>,
): Generator<any, void, any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      payload.etoId,
    );
    yield* etoFlowBackwardsCompat(eto);

    if (eto) {
      const etoData = yield call(loadIssuerPreviewEtoViewInternal, eto, payload.routeMatch);
      yield put(actions.etoView.setEtoViewData(etoData));
      yield put(actions.etoView.watchEtoView(eto));
    } else {
      throw new DataUnavailableError("Could not load eto");
    }
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewIssuerSagas(): Generator<any, void, any> {
  yield fork(neuTakeEvery, actions.etoView.loadIssuerEtoView, loadIssuerEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadIssuerPreviewEtoView, loadIssuerEtoPreview);
  yield fork(
    neuTakeEvery,
    actions.etoView.loadIssuerPreviewEtoViewById,
    loadIssuerPreviewByIdEtoView,
  );
}
