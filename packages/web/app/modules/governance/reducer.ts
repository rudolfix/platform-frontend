import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import { TResolution } from "./types";
import { EProcessState } from "../../utils/enums/processStates";

export enum EModalState {
  OPEN = "open",
  CLOSED = "closed"
}

export type TDocumentUploadState =
  | { documentUploadStatus: EProcessState.SUCCESS } & { documentHash: string }
  | { documentUploadStatus: EProcessState.NOT_STARTED | EProcessState.IN_PROGRESS | EProcessState.ERROR }

export type TGovernanceUpdateModalStateOpen = {
  documentUploadState: TDocumentUploadState,
  updateTitle: string,
  publishButtonDisabled: boolean
}

export type TGovernanceUpdateModalState =
  | ({ modalState: EModalState.OPEN } & TGovernanceUpdateModalStateOpen)
  | ({ modalState: EModalState.CLOSED })

export type TGovernanceViewSuccessState = {
  resolutions: TResolution[];
  governanceUpdateModalState: TGovernanceUpdateModalState;
  companyBrandName: string;
}

export type TGovernanceViewState =
  | { processState: EProcessState.SUCCESS } & { tabVisible: boolean } & TGovernanceViewSuccessState
  | { processState: EProcessState.NOT_STARTED | EProcessState.ERROR | EProcessState.IN_PROGRESS } & { tabVisible: boolean }


const initialState: TGovernanceViewState = {
  tabVisible: false,
  processState: EProcessState.NOT_STARTED,
};

export const initialGovernanceUpdateModalState = {
  modalState: EModalState.OPEN,
  documentUploadState: { documentUploadStatus: EProcessState.NOT_STARTED },
  updateTitle: "",
  publishButtonDisabled: true
} as const

export const reducer: AppReducer<TGovernanceViewState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<TGovernanceViewState> => {
  switch (action.type) {
    case actions.setGovernanceVisibility.getType():
      return {
        ...state,
        tabVisible: action.payload.tabVisible,
      };
    case actions.setGovernanceUpdateData.getType():
      return action.payload.data
    default:
      return state;
  }
};

export const governanceReducerMap = {
  governance: reducer,
};
