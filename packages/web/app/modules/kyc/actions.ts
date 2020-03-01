import { createActionFactory } from "@neufund/shared";

import {
  EKycBusinessType,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycManagingDirector,
  KycBankQuintessenceBankAccount,
  TKycStatus,
} from "../../lib/api/kyc/KycApi.interfaces";
import { kycBeneficialOwnerActions } from "./beneficial-owner/actions";
import { kycFinancialDisclosureActions } from "./financial-disclosure/actions";
import { kycInstantIdIdNowActions } from "./instant-id/id-now/actions";
import { kycInstantIdOnfidoActions } from "./instant-id/onfido/actions";
import { kycLegalRepresentativeActions } from "./legal-representative/actions";
import { TBankAccount, TClaims } from "./types";

export const kycActions = {
  ...kycInstantIdOnfidoActions,
  ...kycInstantIdIdNowActions,
  ...kycFinancialDisclosureActions,
  ...kycBeneficialOwnerActions,
  ...kycLegalRepresentativeActions,

  /**
   * General
   */
  setStatus: createActionFactory("KYC_SET_STATUS", (status: TKycStatus) => ({ status })),
  setStatusLoading: createActionFactory("KYC_SET_STATUS_LOADING"),
  setStatusError: createActionFactory("KYC_SET_STATUS_ERROR", (error: string) => ({ error })),

  kycLoadStatusAndData: createActionFactory("KYC_LOAD_CLIENT_DATA"),

  /**
   * Widget watchers
   */
  kycStartWatching: createActionFactory("KYC_WATCHER_START"),
  kycStopWatching: createActionFactory("KYC_WATCHER_STOP"),

  /**
   * Contract Claims
   */
  kycLoadClaims: createActionFactory("KYC_LOAD_CLAIMS"),
  kycSetClaims: createActionFactory("KYC_SET_CLAIMS", (claims: TClaims) => ({ claims })),

  /**
   * Individual
   */

  // data
  kycSubmitPersonalData: createActionFactory(
    "KYC_SUBMIT_PERSONAL_DATA",
    (data: IKycIndividualData) => ({ data }),
  ),
  kycSubmitPersonalDataAndClose: createActionFactory(
    "KYC_SUBMIT_PERSONAL_DATA_AND_CLOSE",
    (data: IKycIndividualData) => ({ data }),
  ),
  kycSubmitPersonalDataNoRedirect: createActionFactory(
    "KYC_SUBMIT_PERSONAL_DATA_NO_REDIRECT",
    (data: IKycIndividualData) => ({ data }),
  ),
  kycSubmitPersonalAddress: createActionFactory(
    "KYC_SUBMIT_PERSONAL_ADDRESS",
    (data: IKycIndividualData) => ({ data }),
  ),
  kycSubmitPersonalAddressAndClose: createActionFactory(
    "KYC_SUBMIT_PERSONAL_ADDRESS_AND_CLOSE",
    (data: IKycIndividualData) => ({ data }),
  ),

  kycLoadIndividualData: createActionFactory("KYC_LOAD_INDIVIDUAL_DATA"),

  kycUpdateIndividualData: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_DATA",
    (individualDataLoading?: boolean, individualData?: IKycIndividualData) => ({
      individualData,
      individualDataLoading,
    }),
  ),

  // files
  kycLoadIndividualDocumentList: createActionFactory("KYC_LOAD_INDIVIDUAL_FILE_LIST"),

  kycUploadIndividualDocument: createActionFactory("KYC_UPLOAD_INDIVIDUAL_FILE", (file: File) => ({
    file,
  })),

  kycUpdateIndividualDocuments: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_FILES_INFO",
    (individualFilesLoading: boolean, individualFiles: IKycFileInfo[] = []) => ({
      individualFilesLoading,
      individualFiles,
    }),
  ),

  kycUpdateIndividualDocument: createActionFactory(
    "KYC_UPDATE_INDIVIDUAL_FILE_INFO",
    (individualFileUploading: boolean, file?: IKycFileInfo) => ({
      individualFileUploading,
      file,
    }),
  ),

  // request
  kycLoadIndividualRequest: createActionFactory(
    "KYC_LOAD_INDIVIDUAL_REQUEST_STATE",
    (inBackground: boolean = false) => ({
      inBackground,
    }),
  ),

  kycSubmitIndividualRequest: createActionFactory("KYC_SUBMIT_INDIVIDUAL_REQUEST"),

  /*
    Business
   */
  kycSetBusinessType: createActionFactory("KYC_SET_BUSINESS_TYPE", (type: EKycBusinessType) => ({
    type,
  })),

  // business data
  kycSubmitBusinessData: createActionFactory(
    "KYC_SUBMIT_BUSINESS_DATA",
    (data: IKycBusinessData, file?: File, close?: boolean) => ({ data, file, close }),
  ),

  kycLoadBusinessData: createActionFactory("KYC_LOAD_BUSINESS_DATA"),

  kycUpdateBusinessData: createActionFactory(
    "KYC_UPDATE_BUSINESS_DATA",
    (businessDataLoading?: boolean, businessData?: IKycBusinessData) => ({
      businessData,
      businessDataLoading,
    }),
  ),

  // business documents
  kycLoadBusinessDocumentList: createActionFactory("KYC_LOAD_BUSINESS_FILE_LIST"),

  kycUploadBusinessDocument: createActionFactory("KYC_UPLOAD_BUSINESS_FILE", (file: File) => ({
    file,
  })),

  kycUpdateBusinessDocuments: createActionFactory(
    "KYC_UPDATE_BUSINESS_FILES_INFO",
    (businessFilesLoading: boolean, businessFiles: IKycFileInfo[] = []) => ({
      businessFilesLoading,
      businessFiles,
    }),
  ),

  kycUpdateBusinessDocument: createActionFactory(
    "KYC_UPDATE_BUSINESS_FILE_INFO",
    (businessFileUploading: boolean, file?: IKycFileInfo) => ({ businessFileUploading, file }),
  ),

  // managing directors
  kycLoadManagingDirector: createActionFactory("KYC_LOAD_MANAGING_DIRECTOR"),
  kycUpdateManagingDirector: createActionFactory(
    "KYC_UPDATE_MANAGING_DIRECTOR_DATA",
    (managingDirectorLoading: boolean, managingDirector?: IKycManagingDirector) => ({
      managingDirectorLoading,
      managingDirector,
    }),
  ),
  kycSubmitManagingDirector: createActionFactory(
    "KYC_SUBMIT_MANAGING_DIRECTOR_DATA",
    (data: IKycManagingDirector) => ({ data }),
  ),
  kycSubmitAndUploadManagingDirector: createActionFactory(
    "KYC_SUBMIT_AND_UPLOAD_MANAGING_DIRECTOR",
    (data: IKycManagingDirector, file: File) => ({ data, file }),
  ),

  // managing directors documents
  kycLoadManagingDirectorDocumentList: createActionFactory("KYC_LOAD_MANAGING_DIRECTOR_FILE_LIST"),
  kycUpdateManagingDirectorDocuments: createActionFactory(
    "KYC_UPDATE_MANAGING_DIRECTOR_FILES_INFO",
    (managingDirectorFilesLoading: boolean, managingDirectorFiles: IKycFileInfo[] = []) => ({
      managingDirectorFilesLoading,
      managingDirectorFiles,
    }),
  ),
  kycUpdateManagingDirectorDocument: createActionFactory(
    "KYC_UPDATE_MANAGING_DIRECTOR_FILE_INFO",
    (managingDirectorFileUploading: boolean, file?: IKycFileInfo) => ({
      managingDirectorFileUploading,
      file,
    }),
  ),

  kycToggleManagingDirectorModal: createActionFactory(
    "KYC_TOGGLE_MANAGING_DIRECTOR_MODAL",
    (show: boolean) => ({ show }),
  ),

  // request
  kycLoadBusinessRequest: createActionFactory(
    "KYC_LOAD_BUSINESS_REQUEST_STATE",
    (inBackground: boolean = false) => ({ inBackground }),
  ),

  kycSubmitBusinessRequest: createActionFactory("KYC_SUBMIT_BUSINESS_REQUEST"),

  /**
   * Bank Account
   */

  // public actions
  loadBankAccountDetails: createActionFactory("KYC_LOAD_BANK_ACCOUNT_DETAILS"),

  // state mutations
  setBankAccountDetails: createActionFactory(
    "KYC_SET_BANK_ACCOUNT_DETAILS",
    (bankAccount: TBankAccount) => ({ bankAccount }),
  ),

  setQuintessenceBankAccountDetails: createActionFactory(
    "KYC_SET_QUINTESSENCE_BANK_ACCOUNT_DETAILS",
    (quintessenceBankAccount: KycBankQuintessenceBankAccount) => ({ quintessenceBankAccount }),
  ),
};
