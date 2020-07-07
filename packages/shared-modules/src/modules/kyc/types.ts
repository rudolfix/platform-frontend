import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycLegalRepresentative,
  IKycManagingDirector,
  KycBankVerifiedBankAccount,
} from "./lib/http/kyc-api/KycApi.interfaces";

export type TClaims = {
  isVerified: boolean;
  isSophisticatedInvestor: boolean;
  hasBankAccount: boolean;
  isAccountFrozen: boolean;
};

export type TBankAccount =
  | { hasBankAccount: true; details: KycBankVerifiedBankAccount }
  | { hasBankAccount: false };

export enum EBeneficialOwnerType {
  PERSON = "person",
  BUSINESS = "business",
}

export interface IBeneficialOwnerStateProps {
  beneficialOwners: ReadonlyArray<IKycBeneficialOwner>;
  loading: boolean;
  editingOwner: IKycBeneficialOwner | undefined;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  showModal: boolean;
  loadingAll: boolean;
  loadingOne: boolean;
  editingOwnerId: string | undefined;
}

export interface IBusinessDataStateProps {
  currentValues?: IKycBusinessData;
  loadingData: boolean;
  filesUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

export interface ILegalRepresentativeProps {
  legalRepresentative?: IKycLegalRepresentative;
  loadingData: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  showModal: boolean;
}

export interface IManagingDirectorProps {
  currentValues: IKycManagingDirector | undefined;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  dataLoading: boolean;
  showModal: boolean;
}

export enum EJurisdiction {
  GERMANY = "DE",
  LIECHTENSTEIN = "LI",
}
