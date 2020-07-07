import { AppReducer } from "@neufund/sagas";
import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { kycActions } from "./actions";
import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycManagingDirector,
  KycBankQuintessenceBankAccount,
  TKycStatus,
} from "./lib/http/kyc-api/KycApi.interfaces";
import { TBankAccount, TClaims } from "./types";
import { appendIfExists, conditionalCounter, omitUndefined, updateArrayItem } from "./utils";

export interface IKycState {
  status: TKycStatus | undefined;
  statusLoading: boolean;
  statusError: string | undefined;

  // individual
  individualData: IKycIndividualData | undefined;
  individualDataLoading: boolean;

  individualFilesLoading: boolean;
  individualFilesUploadingCount: number;
  individualFiles: IKycFileInfo[];

  // business
  businessData: IKycBusinessData | undefined;
  businessDataLoading: boolean;

  businessFilesLoading: boolean;
  businessFilesUploadingCount: number;
  businessFiles: IKycFileInfo[];

  //managing director
  managingDirector: IKycManagingDirector | undefined;
  managingDirectorLoading: boolean;
  managingDirectorFilesLoading: boolean;
  managingDirectorFilesUploadingCount: number;
  managingDirectorFiles: IKycFileInfo[];
  showManagingDirectorModal: boolean;

  // legal representatives
  legalRepresentative: IKycLegalRepresentative | undefined;
  legalRepresentativeLoading: boolean;
  legalRepresentativeFilesLoading: boolean;
  legalRepresentativeFilesUploadingCount: number;
  legalRepresentativeFiles: IKycFileInfo[];
  showLegalRepresentativeModal: boolean;

  // beneficial owners
  loadingBeneficialOwners: boolean;
  loadingBeneficialOwner: boolean;
  beneficialOwners: IKycBeneficialOwner[];
  beneficialOwnerFilesLoading: Dictionary<boolean>;
  beneficialOwnerFilesUploadingCount: Dictionary<number>;
  beneficialOwnerFiles: Dictionary<IKycFileInfo[]>;
  showBeneficialOwnerModal: boolean;
  editingBeneficialOwnerId: string | undefined;

  // contract claims
  claims: TClaims | undefined;

  // api bank details
  bankAccount: TBankAccount | undefined;
  quintessenceBankAccount: KycBankQuintessenceBankAccount | undefined;

  kycSaving: boolean | undefined;
}

const kycInitialState: IKycState = {
  status: undefined,
  statusLoading: false,
  statusError: undefined,

  individualData: undefined,
  individualDataLoading: false,

  individualFilesLoading: false,
  individualFilesUploadingCount: 0,
  individualFiles: [],

  businessData: undefined,
  businessDataLoading: false,

  businessFilesLoading: false,
  businessFilesUploadingCount: 0,
  businessFiles: [],

  managingDirector: undefined,
  managingDirectorLoading: false,
  managingDirectorFilesLoading: false,
  managingDirectorFilesUploadingCount: 0,
  managingDirectorFiles: [],
  showManagingDirectorModal: false,

  legalRepresentative: undefined,
  legalRepresentativeLoading: false,
  legalRepresentativeFilesLoading: false,
  legalRepresentativeFilesUploadingCount: 0,
  legalRepresentativeFiles: [],
  showLegalRepresentativeModal: false,

  loadingBeneficialOwners: false,
  loadingBeneficialOwner: false,
  beneficialOwners: [],
  beneficialOwnerFiles: {},
  beneficialOwnerFilesLoading: {},
  beneficialOwnerFilesUploadingCount: {},
  showBeneficialOwnerModal: false,
  editingBeneficialOwnerId: undefined,

  claims: undefined,

  bankAccount: undefined,
  quintessenceBankAccount: undefined,
  kycSaving: undefined,
};

export const kycReducer: AppReducer<IKycState, typeof kycActions> = (
  reduxState = kycInitialState,
  action,
): DeepReadonly<IKycState> => {
  const state = {
    ...reduxState,
  };

  switch (action.type) {
    // general
    case kycActions.setStatusLoading.getType():
      return {
        ...state,
        statusLoading: true,
      };
    case kycActions.setStatus.getType():
      return {
        ...state,
        status: action.payload.status,
        statusLoading: false,
        statusError: undefined,
      };
    case kycActions.setStatusError.getType():
      return {
        ...state,
        status: undefined,
        statusLoading: false,
        statusError: action.payload.error,
      };

    // individual
    case kycActions.kycSubmitPersonalData.getType():
    case kycActions.kycSubmitPersonalDataAndClose.getType():
    case kycActions.kycSubmitPersonalDataNoRedirect.getType():
      return { ...state, ...omitUndefined(action.payload), kycSaving: true };
    case kycActions.kycUpdateIndividualData.getType():
      return { ...state, kycSaving: false, ...omitUndefined(action.payload) };
    case kycActions.kycUpdateIndividualDocuments.getType():
      return { ...state, ...omitUndefined(action.payload) };
    case kycActions.kycUpdateIndividualDocument.getType():
      return {
        ...state,
        individualFilesUploadingCount: conditionalCounter(
          action.payload.individualFileUploading,
          state.individualFilesUploadingCount,
        ),
        individualFiles: appendIfExists(state.individualFiles, action.payload.file),
      };

    /**
     * business KYC
     */
    // data & documents
    case kycActions.kycUpdateBusinessData.getType():
    case kycActions.kycUpdateBusinessDocuments.getType():
    case kycActions.kycUpdateManagingDirector.getType():
    case kycActions.kycUpdateManagingDirectorDocuments.getType():
    case kycActions.kycUpdateLegalRepresentative.getType():
    case kycActions.kycUpdateLegalRepresentativeDocuments.getType():
    case kycActions.kycUpdateBeneficialOwners.getType():
      return { ...state, ...omitUndefined(action.payload) };

    // single upload
    case kycActions.kycUpdateLegalRepresentativeDocument.getType():
      return {
        ...state,
        legalRepresentativeFilesUploadingCount: conditionalCounter(
          action.payload.legalRepresentativeUploading,
          state.legalRepresentativeFilesUploadingCount,
        ),
        legalRepresentativeFiles: appendIfExists(
          state.legalRepresentativeFiles,
          action.payload.file,
        ),
      };
    case kycActions.kycUpdateBusinessDocument.getType():
      return {
        ...state,
        businessFilesUploadingCount: conditionalCounter(
          action.payload.businessFileUploading,
          state.businessFilesUploadingCount,
        ),
        businessFiles: appendIfExists(state.businessFiles, action.payload.file),
      };
    case kycActions.kycUpdateManagingDirectorDocument.getType():
      return {
        ...state,
        managingDirectorFilesUploadingCount: conditionalCounter(
          action.payload.managingDirectorFileUploading,
          state.managingDirectorFilesUploadingCount,
        ),
        managingDirectorFiles: appendIfExists(state.managingDirectorFiles, action.payload.file),
      };

    /**
     * Beneficial Owner
     */
    case kycActions.kycUpdateBeneficialOwner.getType():
      return {
        ...state,
        loadingBeneficialOwner: action.payload.loadingBeneficialOwner,
        beneficialOwners: updateArrayItem(
          state.beneficialOwners,
          action.payload.id,
          action.payload.beneficialOwner,
        ),
      };
    case kycActions.kycUpdateBeneficialOwnerDocuments.getType():
      return {
        ...state,
        beneficialOwnerFilesLoading: {
          ...state.beneficialOwnerFilesLoading,
          [action.payload.boid]: action.payload.beneficialOwnerFilesLoading,
        },
        beneficialOwnerFiles: {
          ...state.beneficialOwnerFiles,
          [action.payload.boid]: action.payload.beneficialOwnerFiles,
        },
      };
    case kycActions.kycUpdateBeneficialOwnerDocument.getType():
      const { boid } = action.payload;
      return {
        ...state,
        beneficialOwnerFilesUploadingCount: {
          ...state.beneficialOwnerFilesUploadingCount,
          [boid]: conditionalCounter(
            action.payload.beneficialOwnerFileUploading,
            state.beneficialOwnerFilesUploadingCount[boid],
          ),
        },
        beneficialOwnerFiles: {
          ...state.beneficialOwnerFiles,
          [boid]: appendIfExists(state.beneficialOwnerFiles[boid], action.payload.file),
        },
      };
    //modals
    case kycActions.kycToggleManagingDirectorModal.getType():
      return { ...state, showManagingDirectorModal: action.payload.show };
    case kycActions.kycToggleBeneficialOwnerModal.getType():
      return {
        ...state,
        showBeneficialOwnerModal: action.payload.show,
        editingBeneficialOwnerId: action.payload.boId,
      };
    case kycActions.toggleLegalRepresentativeModal.getType():
      return { ...state, showLegalRepresentativeModal: action.payload.show };
    // contract claims
    case kycActions.kycSetClaims.getType():
      return { ...state, claims: action.payload.claims };

    // api bank account
    case kycActions.setBankAccountDetails.getType(): {
      return { ...state, bankAccount: action.payload.bankAccount };
    }

    case kycActions.setQuintessenceBankAccountDetails.getType(): {
      return { ...state, quintessenceBankAccount: action.payload.quintessenceBankAccount };
    }

    default:
      return state;
  }
};

const kycReducerMap = {
  kyc: kycReducer,
};

export { kycReducerMap };
