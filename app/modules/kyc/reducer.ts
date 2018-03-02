import { AppReducer } from "../../store";

import {
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
} from "../../lib/api/KycApi.interfaces";

export interface IKycState {
  // individual
  individualRequestState?: IKycRequestState;
  individualRequestStateLoading?: boolean;

  individualData?: IKycIndividualData;
  individualDataLoading?: boolean;

  individualFilesLoading?: boolean;
  individualFileUploading?: boolean;
  individualFiles: IKycFileInfo[];

  // business
  businessRequestState?: IKycRequestState;
  businessRequestStateLoading?: boolean;

  businessData?: IKycBusinessData;
  businessDataLoading?: boolean;
  businessFilesLoading?: boolean;
  businessFileUploading?: boolean;
  businessFiles: IKycFileInfo[];

  legalRepresentative?: IKycLegalRepresentative;
  legalRepresentativeLoading?: boolean;
  legalRepresentativeFilesLoading?: boolean;
  legalRepresentativeFileUploading?: boolean;
  legalRepresentativeFiles: IKycFileInfo[];
}

const kycInitialState: IKycState = {
  individualFiles: [],
  businessFiles: [],
  legalRepresentativeFiles: [],
};

export const kycReducer: AppReducer<IKycState> = (state = kycInitialState, action): IKycState => {
  switch (action.type) {
    // individual
    case "KYC_UPDATE_INDIVIDUAL_REQUEST_STATE":
    case "KYC_UPDATE_INDIVIDUAL_DATA":
    case "KYC_UPDATE_INDIVIDUAL_FILES_INFO":
      state = { ...state, ...action.payload };
      break;
    case "KYC_UPDATE_INDIVIDUAL_FILE_INFO":
      state = {
        ...state,
        individualFileUploading: action.payload.individualFileUploading,
        individualFiles: action.payload.file
          ? [...state.individualFiles, action.payload.file]
          : state.individualFiles,
      };
      break;
    // business
    case "KYC_UPDATE_BUSINESS_DATA":
    case "KYC_UPDATE_BUSINESS_REQUEST_STATE":
    case "KYC_UPDATE_BUSINESS_FILES_INFO":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE":
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILES_INFO":
      state = { ...state, ...action.payload };
      break;
    case "KYC_UPDATE_LEGAL_REPRESENTATIVE_FILE_INFO":
      state = {
        ...state,
        legalRepresentativeFileUploading: action.payload.legalRepresentativeUploading,
        legalRepresentativeFiles: action.payload.file
          ? [...state.legalRepresentativeFiles, action.payload.file]
          : state.legalRepresentativeFiles,
      };
      break;
    case "KYC_UPDATE_BUSINESS_FILE_INFO":
      state = {
        ...state,
        businessFileUploading: action.payload.businessFileUploading,
        businessFiles: action.payload.file
          ? [...state.businessFiles, action.payload.file]
          : state.businessFiles,
      };
      break;
  }

  return state;
};
