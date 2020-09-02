import { EResolutionDocumentType } from "@neufund/shared-modules";
import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import * as Yup from "yup";

import { EMimeType } from "../../components/shared/forms/fields/utils";
import { TMessage } from "../../components/translatedMessages/utils";
import { TFormData } from "../../types";
import { EProcessState } from "../../utils/enums/processStates";
import { actions } from "../actions";

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

export enum EGovernanceControllerState {
  SETUP = 0,
  OFFERING = 1,
  FUNDED = 2,
  CLOSING = 3,
  CLOSED = 4,
  MIGRATING = 5,
  MIGRATED = 6,
}

export enum EGovernanceAction {
  NONE = 0,
  REGISTER_OFFER = 1,
  AMEND_GOVERNANCE = 2,
  RESTRICTED_NONE = 3,
  COMPANY_NONE = 4,
  THR_NONE = 5,
  STOP_TOKEN = 6,
  CONTINUE_TOKEN = 7,
  CLOSE_TOKEN = 8,
  ORDINARY_PAYOUT = 9,
  EXTRAORDINARY_PAYOUT = 10,
  CHANGE_TOKEN_CONTROLLER = 11,
  ISSUE_TOKENS_FOR_EXISTING_SHARES = 12,
  ISSUE_SHARES_FOR_EXISTING_TOKENS = 13,
  CHANGE_NOMINEE = 14,
  ANTI_DILUTION_PROTECTION = 15,
  ESTABLISH_AUTHORIZED_CAPITAL = 16,
  ESTABLISH_ESOP = 17,
  CONVERT_ESOP = 18,
  CHANGE_OF_CONTROL = 19,
  DISSOLVE_COMPANY = 20,
  TAG_ALONG = 21,
  ANNUAL_GENERAL_MEETING = 22,
  ANNUAL_SHARES_AND_VALUATION = 23,
  AMEND_VALUATION = 24,
  CANCEL_RESOLUTION = 25,
}

export enum EResolutionState {
  FULL = "full",
  BASIC = "basic",
}

export type TBasicResolutionData = {
  action: EGovernanceAction;
  id: string;
  draft: boolean;
  startedAt: Date;
};

export type TFullResolutionData = {
  title: string;
  documentName: string;
  documentHash: string;
  documentSize: string;
} & TBasicResolutionData;

export type TResolution =
  | ({ resolutionState: EResolutionState.FULL } & TFullResolutionData)
  | ({ resolutionState: EResolutionState.BASIC } & TBasicResolutionData);

export type TResolutionUpdate = {
  title: string;
};

export const GovernanceUpdateSchema = Yup.object().shape({
  updateTitle: Yup.string().required(),
});

export type TResolutionDocumentUploadResult = {
  contract: string;
  createdAt: string;
  documentType: EResolutionDocumentType.RESOLUTION_DOCUMENT;
  form: "document";
  ipfsHash: string;
  mimeType: EMimeType.PDF;
  name: string;
  owner: string;
  resolutionId: string;
  size: 116211;
  title: string;
};

export type TUpdate =
  | { uploadFile: ReturnType<typeof actions.governance.uploadFile> }
  | { onFileUpload: ReturnType<typeof actions.governance.onFileUpload> }
  | { removeFile: ReturnType<typeof actions.governance.removeFile> }
  | { onFileRemove: ReturnType<typeof actions.governance.onFileRemove> }
  | { onFormBlur: ReturnType<typeof actions.governance.onFormBlur> }
  | { onFormChange: ReturnType<typeof actions.governance.onFormChange> }
  | { closeGovernanceUpdateModal: ReturnType<typeof actions.governance.closeGovernanceUpdateModal> }
  | { openGovernanceUpdateModal: ReturnType<typeof actions.governance.openGovernanceUpdateModal> }
  | { publishUpdate: ReturnType<typeof actions.governance.publishUpdate> }
  | { updatePublishSuccess: ReturnType<typeof actions.governance.updatePublishSuccess> }
  | { downloadIpfsDocument: ReturnType<typeof actions.governance.downloadIpfsDocument> };

//-- type guards
export const modalStateIsOpen = <T>(
  x: { modalState: EModalState } & T,
): x is { modalState: EModalState.OPEN } & T => x.modalState === EModalState.OPEN;

export const documentUploadStateIsSuccess = (
  x: any,
): x is { documentUploadStatus: EProcessState.SUCCESS; document: File } =>
  x.documentUploadStatus === EProcessState.SUCCESS;

export const documentUploadStatusIsSuccess = (
  x: any,
): x is { documentUploadStatus: EProcessState.SUCCESS } =>
  x.documentUploadStatus === EProcessState.SUCCESS;

export const hasUploadFile = (
  x: any,
): x is { uploadFile: ReturnType<typeof actions.governance.uploadFile> } =>
  x.uploadFile !== undefined;

export const hasRemoveFile = (
  x: any,
): x is { removeFile: ReturnType<typeof actions.governance.removeFile> } =>
  x.removeFile !== undefined;

export const hasOnFormBlur = (
  x: any,
): x is { onFormBlur: ReturnType<typeof actions.governance.onFormBlur> } =>
  x.onFormBlur !== undefined;

export const hasOnFormChange = (
  x: any,
): x is { onFormChange: ReturnType<typeof actions.governance.onFormChange> } =>
  x.onFormChange !== undefined;

export const hasCloseGovernanceUpdateModal = (
  x: any,
): x is {
  closeGovernanceUpdateModal: ReturnType<typeof actions.governance.closeGovernanceUpdateModal>;
} => x.closeGovernanceUpdateModal !== undefined;

export const hasOpenGovernanceUpdateModal = (
  x: any,
): x is {
  openGovernanceUpdateModal: ReturnType<typeof actions.governance.openGovernanceUpdateModal>;
} => x.openGovernanceUpdateModal !== undefined;

export const hasPublishUpdate = (
  x: any,
): x is { publishUpdate: ReturnType<typeof actions.governance.publishUpdate> } =>
  x.publishUpdate !== undefined;

export const hasDownloadDocument = (
  x: any,
): x is { downloadIpfsDocument: ReturnType<typeof actions.governance.downloadIpfsDocument> } =>
  x.downloadIpfsDocument !== undefined;

export const hasUpdateResolution = (
  x: any,
): x is {
  resolutionUpdateReceived: ReturnType<typeof actions.governance.resolutionUpdateReceived>;
} => x.resolutionUpdateReceived !== undefined;

export const hasUpdatePublishSuccess = (
  x: any,
): x is { updatePublishSuccess: ReturnType<typeof actions.governance.updatePublishSuccess> } =>
  x.updatePublishSuccess !== undefined;

export const resolutionIsFull = (
  x: any,
): x is { resolutionState: EResolutionState.FULL } & TFullResolutionData =>
  x.resolutionState === EResolutionState.FULL;
