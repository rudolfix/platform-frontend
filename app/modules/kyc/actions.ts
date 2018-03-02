import { isNil, omitBy } from "lodash";
import {
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
  TKycBusinessType,
} from "../../lib/api/KycApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

const stripUndefined = (obj: any) => omitBy(obj, isNil);

export const kycActions = {
  /**
   * Individual
   */

  // data
  kycSubmitIndividualData: (data: IKycIndividualData) =>
    createAction("KYC_SUBMIT_INDIVIDUAL_FORM", { data }),

  kycLoadIndividualData: () => createSimpleAction("KYC_LOAD_INDIVIDUAL_DATA"),

  kycUpdateIndividualData: (individualDataLoading?: boolean, individualData?: IKycIndividualData) =>
    createAction(
      "KYC_UPDATE_INDIVIDUAL_DATA",
      stripUndefined({ individualData, individualDataLoading }),
    ),

  // files
  kycLoadIndividualDocumentList: () => createSimpleAction("KYC_LOAD_INDIVIDUAL_FILE_LIST"),

  kycUploadIndividualDocument: (file: File) => createAction("KYC_UPLOAD_INDIVIDUAL_FILE", { file }),

  kycUpdateIndividualDocuments: (
    individualFilesLoading: boolean,
    individualFiles: IKycFileInfo[] = [],
  ) =>
    createAction("KYC_UPDATE_INDIVIDUAL_FILES_INFO", { individualFilesLoading, individualFiles }),

  kycUpdateIndividualDocument: (individualFileUploading: boolean, file?: IKycFileInfo) =>
    createAction("KYC_UPDATE_INDIVIDUAL_FILE_INFO", { individualFileUploading, file }),

  // request
  kycLoadIndividualRequest: () => createSimpleAction("KYC_LOAD_INDIVIDUAL_REQUEST_STATE"),

  kycUpdateIndividualRequestState: (
    individualRequestStateLoading?: boolean,
    individualRequestState?: IKycRequestState,
  ) =>
    createAction(
      "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE",
      stripUndefined({ individualRequestState, individualRequestStateLoading }),
    ),

  kycSubmitIndividualRequest: () => createSimpleAction("KYC_SUBMIT_INDIVIDUAL_REQUEST"),

  /*
    Business...
   */
  kycSetBusinessType: (type: TKycBusinessType) => createAction("KYC_SET_BUSINESS_TYPE", { type }),

  // business data
  kycSubmitBusinessData: (data: IKycBusinessData) =>
    createAction("KYC_SUBMIT_BUSINESS_DATA", { data }),

  kycLoadBusinessData: () => createSimpleAction("KYC_LOAD_BUSINESS_DATA"),

  kycUpdateBusinessData: (businessDataLoading?: boolean, businessData?: IKycBusinessData) =>
    createAction("KYC_UPDATE_BUSINESS_DATA", stripUndefined({ businessData, businessDataLoading })),

  // business documents
  kycLoadBusinessDocumentList: () => createSimpleAction("KYC_LOAD_BUSINESS_FILE_LIST"),

  kycUploadBusinessDocument: (file: File) => createAction("KYC_UPLOAD_BUSINESS_FILE", { file }),

  kycUpdateBusinessDocuments: (businessFilesLoading: boolean, businessFiles: IKycFileInfo[] = []) =>
    createAction("KYC_UPDATE_BUSINESS_FILES_INFO", { businessFilesLoading, businessFiles }),

  kycUpdateBusinessDocument: (businessFileUploading: boolean, file?: IKycFileInfo) =>
    createAction("KYC_UPDATE_BUSINESS_FILE_INFO", { businessFileUploading, file }),

  // legal representative data
  kycSubmitLegalRepresentative: (data: IKycLegalRepresentative) =>
    createAction("KYC_SUBMIT_LEGAL_REPRESENTATIVE", { data }),

  kycLoadLegalRepresentative: () => createSimpleAction("KYC_LOAD_LEGAL_REPRESENTATIVE"),

  kycUpdateLegalRepresentative: (
    legalRepresentativeLoading?: boolean,
    legalRepresentative?: IKycLegalRepresentative,
  ) =>
    createAction(
      "KYC_UPDATE_LEGAL_REPRESENTATIVE",
      stripUndefined({ legalRepresentative, legalRepresentativeLoading }),
    ),

  // legal representative documents
  kycLoadLegalRepresentativeDocumentList: () =>
    createSimpleAction("KYC_LOAD_LEGAL_REPRESENTATIVE_FILE_LIST"),

  kycUploadLegalRepresentativeDocument: (file: File) =>
    createAction("KYC_UPLOAD_LEGAL_REPRESENTATIVE_FILE", { file }),

  kycUpdateLegalRepresentativeDocuments: (
    legalRepresentativeLoading: boolean,
    legalRepresentativeFiles: IKycFileInfo[] = [],
  ) =>
    createAction("KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO", {
      legalRepresentativeLoading,
      legalRepresentativeFiles,
    }),

  kycUpdateLegalRepresentativeDocument: (
    legalRepresentativeUploading: boolean,
    file?: IKycFileInfo,
  ) =>
    createAction("KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO", {
      legalRepresentativeUploading,
      file,
    }),

  // beneficial owners

  // beneficial owners documents

  // request
  kycLoadBusinessRequest: () => createSimpleAction("KYC_LOAD_BUSINESS_REQUEST_STATE"),

  kycUpdateBusinessRequestState: (
    businessRequestStateLoading?: boolean,
    businessRequestState?: IKycRequestState,
  ) =>
    createAction(
      "KYC_UPDATE_BUSINESS_REQUEST_STATE",
      stripUndefined({ businessRequestState, businessRequestStateLoading }),
    ),

  kycSubmitBusinessRequest: () => createSimpleAction("KYC_SUBMIT_BUSINESS_REQUEST"),
};
