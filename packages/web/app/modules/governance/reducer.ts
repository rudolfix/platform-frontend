import { AppReducer } from "@neufund/sagas";
import { EResolutionDocumentType } from "@neufund/shared-modules";
import { DeepReadonly, EthereumAddressWithChecksum } from "@neufund/shared-utils";

import { EMimeType } from "../../components/shared/forms";
import { TMessage } from "../../components/translatedMessages/utils";
import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "./actions";
import { TResolution } from "./types";

export type TDocumentUploadResponse = {
  contract: EthereumAddressWithChecksum;
  createdAt: string;
  documentType: EResolutionDocumentType.RESOLUTION_DOCUMENT;
  form: string;
  ipfsHash: string;
  mimeType: EMimeType;
  name: string;
  owner: EthereumAddressWithChecksum;
  resolutionId: string;
  size: number;
  title: string;
};

export type TFormDataCommon = {
  errors: TMessage[];
  isValid: boolean;
  disabled: boolean;
  validations: Function[];
  id: string;
};

export type TFormFieldData<T> = {
  value: T;
} & TFormDataCommon;

export type TFormData<T, V> = {
  fields: { [K in keyof T]: TFormFieldData<V> };
} & TFormDataCommon;

export enum EModalState {
  OPEN = "open",
  CLOSED = "closed",
}

export type TDocumentUploadState =
  | ({ documentUploadStatus: EProcessState.SUCCESS } & { document: File })
  | {
      documentUploadStatus:
        | EProcessState.NOT_STARTED
        | EProcessState.IN_PROGRESS
        | EProcessState.ERROR;
    };

export type TGovernanceUpdateModalStateOpen = {
  documentUploadState: TDocumentUploadState;
  governanceUpdateTitleForm: TFormData<{ updateTitle: string }, string>;
  publishButtonDisabled: boolean;
};

export type TGovernanceUpdateModalState =
  | ({ modalState: EModalState.OPEN } & TGovernanceUpdateModalStateOpen)
  | { modalState: EModalState.CLOSED };

export type TGovernanceViewSuccessState = {
  resolutions: TResolution[];
  governanceUpdateModalState: TGovernanceUpdateModalState;
  companyBrandName: string;
};

export type TGovernanceViewState =
  | ({ processState: EProcessState.SUCCESS } & {
      tabVisible: boolean;
    } & TGovernanceViewSuccessState)
  | ({
      processState: EProcessState.NOT_STARTED | EProcessState.ERROR | EProcessState.IN_PROGRESS;
    } & { tabVisible: boolean });

const initialState: TGovernanceViewState = {
  tabVisible: false,
  processState: EProcessState.NOT_STARTED,
};

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
      return action.payload.data;
    default:
      return state;
  }
};

export const governanceReducerMap = {
  governance: reducer,
};
