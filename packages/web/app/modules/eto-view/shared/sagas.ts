import { call, fork, put, select } from "@neufund/sagas";
import { match } from "react-router";

import { appRoutes } from "../../../components/appRoutes";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { EEtoState } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EUserType } from "../../../lib/api/users/interfaces";
import { EProcessState } from "../../../utils/enums/processStates";
import { actions } from "../../actions";
import { selectUserType } from "../../auth/selectors";
import { shouldLoadPledgeData } from "../../bookbuilding-flow/utils";
import { delayEtoRefresh, loadEtoWithCompanyAndContract } from "../../eto/sagas";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContractReadonly,
} from "../../eto/types";
import { TEtoViewByPreviewCodeMatch } from "../../routing/types";
import { neuCall, neuTakeLatest, neuTakeLatestUntil } from "../../sagasUtils";
import { etoViewInvestorSagas } from "../investor/sagas";
import { etoViewIssuerSagas } from "../issuer/sagas";
import { etoViewNomineeSagas } from "../nominee/sagas";
import { etoViewNotAuthSagas } from "../notAuth/sagas";
import { selectEtoViewData } from "./selectors";
import {
  EEtoViewCampaignOverviewType,
  TCampaignOverviewData,
  TCampaignOverviewParams,
  TEtoViewState,
} from "./types";
import {
  getTwitterData,
  shouldShowInvestmentTerms,
  shouldShowProspectusDisclaimer,
  shouldShowSlideshare,
  shouldShowSocialChannels,
  shouldShowTimeline,
  shouldShowYouTube,
} from "./utils";

export function* calculateEtoViewCampaignOverviewType(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, EEtoViewCampaignOverviewType, any> {
  const userType = yield select(selectUserType);
  const timedState = eto.contract && eto.contract.timedState;
  const subState = eto.subState;

  if (timedState) {
    if (userType === EUserType.ISSUER && timedState === EETOStateOnChain.Whitelist) {
      return EEtoViewCampaignOverviewType.WITH_STATS;
    } else if (
      timedState === EETOStateOnChain.Whitelist &&
      subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE
    ) {
      return EEtoViewCampaignOverviewType.WITH_STATS;
    } else if (timedState >= 2) {
      //from public onwards
      return EEtoViewCampaignOverviewType.WITH_STATS;
    }
  }

  return EEtoViewCampaignOverviewType.WITHOUT_STATS;
}

export function* getCampaignOverviewData(
  eto: TEtoWithCompanyAndContractReadonly,
  viewAsUserType: EUserType,
): Generator<any, TCampaignOverviewParams, any> {
  const twitterData = yield* call(getTwitterData, eto.company);

  return {
    showTimeline: yield* call(shouldShowTimeline, eto),
    showDisclaimer: yield* call(shouldShowProspectusDisclaimer, eto),
    showYouTube: yield* call(shouldShowYouTube, eto.company),
    showSlideshare: yield* call(shouldShowSlideshare, eto.company),
    showSocialChannels: yield* call(shouldShowSocialChannels, eto.company),
    showInvestmentTerms: yield* call(shouldShowInvestmentTerms, eto, viewAsUserType),
    ...twitterData,
  };
}

export function* calculateCampaignOverviewDataIssuerNominee(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, TCampaignOverviewData, any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );
  const campaignOverviewCommonData = yield call(getCampaignOverviewData, eto, EUserType.ISSUER);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: appRoutes.etoIssuerView,
      path: appRoutes.etoIssuerView,
    };
  } else {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: appRoutes.etoIssuerView,
    };
  }
}

export function* calculateCampaignOverviewData(
  routeMatch: match<TEtoViewByPreviewCodeMatch | {}>,
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, TCampaignOverviewData, any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );

  const campaignOverviewCommonData = yield call(getCampaignOverviewData, eto, EUserType.INVESTOR);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: routeMatch.url,
      path: routeMatch.path,
    };
  } else {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: routeMatch.url,
    };
  }
}

export function* saveEto(eto: TEtoWithCompanyAndContractReadonly): Generator<any, void, any> {
  if (eto.contract) {
    yield put(actions.eto.setEtoDataFromContract(eto.previewCode, eto.contract));
  }
  yield put(actions.eto.setEto({ eto, company: eto.company }));
}

export function* saveUsersPledge(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, void, any> {
  const onChainState = eto.contract && eto.contract.timedState;

  if (shouldLoadPledgeData(eto.state, onChainState)) {
    yield put(actions.bookBuilding.loadPledge(eto.etoId));
  }
}

export function* saveBookbuildingStats(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, void, any> {
  if (eto.subState === EEtoSubState.WHITELISTING && eto.isBookbuilding) {
    yield put(actions.bookBuilding.loadBookBuildingStats(eto.etoId));
  }
}

export function* etoFlowBackwardsCompat(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, void, any> {
  // save various pieces of data for backwards compatibility with other flows, e.g. investment
  yield call(saveEto, eto);
  yield call(saveUsersPledge, eto);
  yield call(saveBookbuildingStats, eto);
}

export function* reloadEtoView({
  logger,
  notificationCenter,
}: TGlobalDependencies): Generator<any, void, any> {
  try {
    const oldEtoViewData: TEtoViewState = yield select(selectEtoViewData);

    if (oldEtoViewData.processState !== EProcessState.SUCCESS) {
      return;
    }

    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      oldEtoViewData.eto.previewCode,
    );

    yield* performLoadEtoSideEffects(eto);

    const etoData = {
      ...oldEtoViewData,
      eto,
    };

    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not reload eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* performLoadEtoSideEffects(
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, void, any> {
  yield* etoFlowBackwardsCompat(eto);

  if (eto.state === EEtoState.ON_CHAIN) {
    yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
  }
}

export function* etoViewWatcher(
  _: TGlobalDependencies,
  eto: TEtoWithCompanyAndContractReadonly,
): Generator<any, void, any> {
  while (true) {
    yield neuCall(delayEtoRefresh, eto);
    yield put(actions.etoView.reloadEtoView());
  }
}

export function* etoViewSagas(): Generator<any, void, any> {
  yield* etoViewNotAuthSagas();
  yield* etoViewIssuerSagas();
  yield* etoViewInvestorSagas();
  yield* etoViewNomineeSagas();
  yield fork(neuTakeLatest, actions.etoView.reloadEtoView, reloadEtoView);
  yield fork(
    neuTakeLatestUntil,
    actions.etoView.watchEtoView,
    "@@router/LOCATION_CHANGE",
    etoViewWatcher,
  );
}
