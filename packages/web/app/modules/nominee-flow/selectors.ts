import { DataUnavailableError, objectToFilteredArray } from "@neufund/shared";
import { createSelector } from "reselect";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { nomineeIgnoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { TAppGlobalState } from "../../store";
import { selectStartOfOnchainState } from "../eto/selectors";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
  TOfferingAgreementsStatus,
} from "../eto/types";
import { selectRouter } from "../routing/selectors";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeRequestStatus,
  ENomineeTask,
  ERedeemShareCapitalTaskSubstate,
  TNomineeEtoSpecificTaskData,
  TNomineeEtoSpecificTasksStatus,
  TNomineeRequestStorage,
  TNomineeTaskAcceptIshaData,
} from "./types";
import { getActiveEtoPreviewCodeFromQueryString } from "./utils";

export const selectNomineeFlow = (state: TAppGlobalState) => state.nomineeFlow;

export const selectNomineeStateIsLoading = (state: TAppGlobalState) => state.nomineeFlow.loading;

export const selectNomineeDashboardIsReady = (state: TAppGlobalState) => state.nomineeFlow.ready;

export const selectNomineeFlowError = (state: TAppGlobalState) => state.nomineeFlow.error;

export const selectNomineeFlowHasError = (state: TAppGlobalState) => {
  const error = selectNomineeFlowError(state);
  return error !== ENomineeFlowError.NONE;
};

export const selectNomineeRequestError = (state: TAppGlobalState): ENomineeRequestError => {
  const linkToIssuerData = state.nomineeFlow.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("taskData for the 'LINK_TO_ISSUER' step is missing");
  } else {
    return linkToIssuerData.error;
  }
};

export const selectNomineeTasksData = (state: TAppGlobalState) =>
  state.nomineeFlow.nomineeTasksData;

export const selectLinkToIssuerNextState = (state: TAppGlobalState) => {
  const linkToIssuerData = state.nomineeFlow.nomineeTasksData[ENomineeTask.LINK_TO_ISSUER];
  if (linkToIssuerData === undefined) {
    throw new DataUnavailableError("taskData for the 'LINK_TO_ISSUER' step is missing");
  } else {
    return linkToIssuerData && linkToIssuerData.nextState;
  }
};

export const selectNomineeRequests = (state: TAppGlobalState): TNomineeRequestStorage =>
  state.nomineeFlow.nomineeRequests;

export const selectLinkedNomineeEtoId = (state: TAppGlobalState): string | undefined =>
  state.nomineeFlow.nomineeRequests &&
  Object.keys(state.nomineeFlow.nomineeRequests).find(
    requestId =>
      state.nomineeFlow.nomineeRequests[requestId].state === ENomineeRequestStatus.APPROVED,
  );

export const selectNomineeEtos = (
  state: TAppGlobalState,
): { [previewCode: string]: TEtoWithCompanyAndContract | undefined } =>
  state.nomineeFlow.nomineeEtos;

export const selectNomineeTasksStatus = (state: TAppGlobalState) =>
  state.nomineeFlow.nomineeTasksStatus;

export const selectNomineeActiveEtoPreviewCode = (state: TAppGlobalState): string | undefined =>
  state.nomineeFlow.activeNomineeEtoPreviewCode;

export const selectActiveNomineeEto = createSelector(
  selectNomineeEtos,
  selectNomineeActiveEtoPreviewCode,
  (etos, etoPreviewCode) => {
    if (etoPreviewCode && etos) {
      return etos[etoPreviewCode];
    }

    return undefined;
  },
);

export const selectNomineeEtoState = (state: TAppGlobalState) => {
  const eto = selectActiveNomineeEto(state);
  return eto ? eto.state : undefined;
};

export const selectNomineeEtoTemplatesArray = (state: TAppGlobalState): IEtoDocument[] => {
  const eto = selectActiveNomineeEto(state);
  const filterFunction = (key: string) =>
    !nomineeIgnoredTemplates.some((templateKey: string) => templateKey === key);

  return eto !== undefined ? objectToFilteredArray(filterFunction, eto.templates) : [];
};

export const selectNomineeEtoDocumentsStatus = (
  state: TAppGlobalState,
  previewCode: string,
): TOfferingAgreementsStatus | undefined => {
  const statuses = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return statuses && statuses.offeringAgreementsStatus;
};

export const selectIsISHASignedByIssuer = (state: TAppGlobalState, previewCode: string) => {
  const etoData = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return etoData && etoData.investmentAgreementUrl;
};

export const selectCapitalIncrease = (state: TAppGlobalState) => {
  const activeNomineeEtoPreviewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData =
    activeNomineeEtoPreviewCode &&
    state.nomineeFlow.nomineeTasksData.byPreviewCode[activeNomineeEtoPreviewCode];

  return (
    taskData &&
    taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL] &&
    taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL].capitalIncrease
  );
};

export const selectRedeemShareCapitalTaskSubstate = (
  state: TAppGlobalState,
): ERedeemShareCapitalTaskSubstate => {
  const activeNomineeEtoPreviewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData =
    activeNomineeEtoPreviewCode &&
    state.nomineeFlow.nomineeTasksData.byPreviewCode[activeNomineeEtoPreviewCode];

  if (taskData && taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]) {
    return taskData[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL].taskSubstate;
  } else {
    throw new DataUnavailableError(
      `task substate is missing! activeNomineeEtoPreviewCode:${activeNomineeEtoPreviewCode}`,
    );
  }
};

export const selectNomineeTaskStep = (state: TAppGlobalState) =>
  state.nomineeFlow.activeNomineeTask;

export const selectActiveEtoPreviewCodeFromQueryString = createSelector(selectRouter, state =>
  getActiveEtoPreviewCodeFromQueryString(state.location.search),
);

export const selectNomineeInvestmentAgreementHash = (
  state: TAppGlobalState,
  previewCode: string,
) => {
  const nomineeEtosAdditionalData = state.nomineeFlow.nomineeEtosAdditionalData[previewCode];
  return nomineeEtosAdditionalData && nomineeEtosAdditionalData.investmentAgreementUrl;
};

export const selectEtoSpecificTasksStatus = (
  state: TAppGlobalState,
  previewCode: string,
): TNomineeEtoSpecificTasksStatus | undefined =>
  state.nomineeFlow.nomineeTasksStatus.byPreviewCode[previewCode];

export const selectEtoSpecificTaskData = (
  state: TAppGlobalState,
  previewCode: string,
): TNomineeEtoSpecificTaskData | undefined =>
  state.nomineeFlow.nomineeTasksData.byPreviewCode[previewCode];

export const selectAcceptIshaStateData = (
  state: TAppGlobalState,
): TNomineeTaskAcceptIshaData | undefined => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  const taskData = previewCode && selectEtoSpecificTaskData(state, previewCode);

  if (!(taskData && taskData[ENomineeEtoSpecificTask.ACCEPT_ISHA])) {
    return undefined;
  } else {
    return taskData[ENomineeEtoSpecificTask.ACCEPT_ISHA];
  }
};

export const selectNomineeAcceptIshaUploadState = (state: TAppGlobalState) => {
  const acceptIshaStateData = selectAcceptIshaStateData(state);
  return acceptIshaStateData && acceptIshaStateData.uploadState;
};

export const selectNomineeAcceptIshaUploadedFileName = (state: TAppGlobalState) => {
  const acceptIshaStateData = selectAcceptIshaStateData(state);
  return acceptIshaStateData && acceptIshaStateData.uploadedFileName;
};

export const selectNomineeCompanyName = (state: TAppGlobalState, previewCode: string) => {
  const eto = selectNomineeEtos(state)[previewCode];
  return eto && eto.company.name;
};

export const selectNomineeActiveEtoCompanyName = (state: TAppGlobalState) => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  return previewCode && selectNomineeCompanyName(state, previewCode);
};

export const selectClaimStateDeadlineTimestamp = (state: TAppGlobalState) => {
  const previewCode = selectNomineeActiveEtoPreviewCode(state);
  const startOfClaimState =
    previewCode && selectStartOfOnchainState(state, previewCode, EETOStateOnChain.Claim);

  if (startOfClaimState) {
    const timeLeft = startOfClaimState.getTime() - Date.now();
    return timeLeft > 0 ? startOfClaimState.getTime() : Date.now();
  } else {
    return undefined;
  }
};
