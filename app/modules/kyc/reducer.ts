import { filter, findIndex, isNil, omitBy } from "lodash";
import { AppReducer } from "../../store";

import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
} from "../../lib/api/KycApi.interfaces";
import { DeepReadonly } from "../../types";

export interface IKycState {
  // individual
  individualRequestState?: IKycRequestState;
  individualRequestStateLoading?: boolean;
  individualRequestError?: string;

  individualData?: IKycIndividualData;
  individualDataLoading?: boolean;

  individualFilesLoading?: boolean;
  individualFileUploading?: boolean;
  individualFiles: IKycFileInfo[];

  // business
  businessRequestState?: IKycRequestState;
  businessRequestStateLoading?: boolean;
  businessRequestError?: string;

  businessData?: IKycBusinessData;
  businessDataLoading?: boolean;

  businessFilesLoading?: boolean;
  businessFileUploading?: boolean;
  businessFiles: IKycFileInfo[];

  // legal representatives
  legalRepresentative?: IKycLegalRepresentative;
  legalRepresentativeLoading?: boolean;
  legalRepresentativeFilesLoading?: boolean;
  legalRepresentativeFileUploading?: boolean;
  legalRepresentativeFiles: IKycFileInfo[];

  // beneficial owners
  loadingBeneficialOwners?: boolean;
  loadingBeneficialOwner?: boolean;
  beneficialOwners: IKycBeneficialOwner[];
  beneficialOwnerFilesLoading: { [id: string]: boolean };
  beneficialOwnerFileUploading: { [id: string]: boolean };
  beneficialOwnerFiles: { [id: string]: IKycFileInfo[] };
}

const kycInitialState: IKycState = {
  individualFiles: [],
  businessFiles: [],
  legalRepresentativeFiles: [],
  beneficialOwners: [],
  beneficialOwnerFiles: {},
  beneficialOwnerFilesLoading: {},
  beneficialOwnerFileUploading: {},
};

function appendIfExists<T>(array: ReadonlyArray<T>, item: T | undefined): ReadonlyArray<T> {
  if (!array) array = [];
  if (item) return [...array, item];
  return array;
}

export function updateArrayItem<T extends { id?: string }>(
  array: ReadonlyArray<T>,
  id?: string,
  item?: T,
): ReadonlyArray<T> {
  if (!id) return array; // no changes
  if (id && !item) return filter(array, item => item.id !== id); // delete item
  if (id && item) {
    const index = findIndex(array, item => item.id === id);
    if (index === -1) return [...array, item]; // append

    return [...array.slice(0, index), item, ...array.slice(index + 1)];
  }
  return array;
}

function omitUndefined<T>(obj: T): { [P in keyof T]?: T[P] } {
  return omitBy(obj, isNil) as any;
}

export const kycReducer: AppReducer<IKycState> = (
  state = kycInitialState,
  action,
): DeepReadonly<IKycState> => {
  switch (action.type) {
    // individual
    case "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE":
    case "KYC_UPDATE_INDIVIDUAL_DATA":
    case "KYC_UPDATE_INDIVIDUAL_FILES_INFO":
      state = { ...state, ...omitUndefined(action.payload) };
      break;
    case "KYC_UPDATE_INDIVIDUAL_FILE_INFO":
      state = {
        ...state,
        individualFileUploading: action.payload.individualFileUploading,
        individualFiles: appendIfExists(state.individualFiles, action.payload.file),
      };
      break;
    case "KYC_UPDATE_BUSINESS_DATA":
    case "KYC_UPDATE_BUSINESS_REQUEST_STATE":
    case "KYC_UPDATE_BUSINESS_FILES_INFO":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO":
    case "KYC_UPDATE_BENEFICIAL_OWNERS":
      state = { ...state, ...omitUndefined(action.payload) };
      break;
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO":
      state = {
        ...state,
        legalRepresentativeFileUploading: action.payload.legalRepresentativeUploading,
        legalRepresentativeFiles: appendIfExists(
          state.legalRepresentativeFiles,
          action.payload.file,
        ),
      };
      break;
    case "KYC_UPDATE_BUSINESS_FILE_INFO":
      state = {
        ...state,
        businessFileUploading: action.payload.businessFileUploading,
        businessFiles: appendIfExists(state.businessFiles, action.payload.file),
      };
      break;
    case "KYC_UPDATE_BENEFICIAL_OWNER":
      state = {
        ...state,
        loadingBeneficialOwner: action.payload.loadingBeneficialOwner,
        beneficialOwners: updateArrayItem(
          state.beneficialOwners,
          action.payload.id,
          action.payload.beneficialOwner,
        ),
      };
      break;
    case "KYC_UPDATE_BENEFICIAL_OWNER_FILES_INFO":
      state = {
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
      break;
    case "KYC_UPDATE_BENEFICIAL_OWNER_FILE_INFO":
      const { boid } = action.payload;
      state = {
        ...state,
        beneficialOwnerFileUploading: {
          ...state.beneficialOwnerFileUploading,
          [boid]: action.payload.beneficialOwnerFileUploading,
        },
        beneficialOwnerFiles: {
          ...state.beneficialOwnerFiles,
          [boid]: appendIfExists(state.beneficialOwnerFiles[boid], action.payload.file),
        },
      };
      break;
  }

  return state;
};
