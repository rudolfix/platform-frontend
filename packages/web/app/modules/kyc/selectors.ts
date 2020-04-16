import { DeepReadonly } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { IStateProps as IBeneficialOwnerStateProps } from "../../components/kyc/business/BeneficialOwners";
import { IStateProps as IBusinessDataStateProps } from "../../components/kyc/business/BusinessData";
import { IStateProps as ILegalRepresentativeProps } from "../../components/kyc/business/LegalRepresentative";
import { IStateProps as IManagingDirectorProps } from "../../components/kyc/business/ManagingDirectors";
import {
  EKycRequestStatus,
  IKycFileInfo,
  KycBankQuintessenceBankAccount,
} from "../../lib/api/kyc/KycApi.interfaces";
import { TAppGlobalState } from "../../store";
import { IKycState } from "./reducer";
import { TBankAccount } from "./types";
import { getBeneficialOwnerId } from "./utils";

export const selectKyc = (state: TAppGlobalState) => state.kyc;

export const selectKycStatus = createSelector(selectKyc, kyc => kyc.status);

export const selectIsKycProhibitedRegion = createSelector(
  selectKycStatus,
  status => !!status && status.inProhibitedRegion,
);

export const selectKycRequestType = createSelector(
  selectKycStatus,
  status => status && status.type,
);

export const selectIndividualData = (state: TAppGlobalState) => state.kyc.individualData;
export const selectIndividualDataLoading = (state: TAppGlobalState) =>
  !!state.kyc.individualDataLoading;
export const selectIsSavingKycForm = (state: TAppGlobalState) => !!state.kyc.kycSaving;

export const selectIndividualFiles = (state: TAppGlobalState) => state.kyc.individualFiles;
export const selectIndividualFilesLoading = (state: TAppGlobalState) =>
  state.kyc.individualFilesLoading;
export const selectIndividualFilesUploading = (state: TAppGlobalState): boolean =>
  state.kyc.individualFilesUploadingCount > 0;

export const selectBusinessFiles = (state: TAppGlobalState) => state.kyc.businessFiles;
export const selectBusinessFilesUploading = (state: TAppGlobalState): boolean =>
  state.kyc.businessFilesUploadingCount > 0;

export const selectLegalRepFiles = (state: TAppGlobalState) => state.kyc.legalRepresentativeFiles;
export const selectLegalRepFilesUploading = (state: TAppGlobalState): boolean =>
  state.kyc.legalRepresentativeFilesUploadingCount > 0;

export const selectBeneficialOwnerFilesUploading = (
  state: TAppGlobalState,
  fileId: string,
): boolean => state.kyc.beneficialOwnerFilesUploadingCount[fileId] > 0;

export const selectKycUploadedFiles = (state: TAppGlobalState) =>
  selectIndividualFiles(state) || selectBusinessFiles(state) || selectLegalRepFiles(state);

export const selectKycRequestStatus = (state: TAppGlobalState): EKycRequestStatus | undefined => {
  const kycStatus = selectKycStatus(state);

  if (kycStatus) {
    return kycStatus.status === EKycRequestStatus.ACCEPTED && !selectIsClaimsVerified(state)
      ? EKycRequestStatus.PENDING
      : kycStatus.status;
  }

  return undefined;
};

export const selectKycInstantIdStatus = createSelector(
  selectKycStatus,
  status => status && status.instantIdStatus,
);

/**
 * In case it's a prohibited region by ip and kyc process was not yet started (DRAFT) returns true.
 */
export const selectIsKycFlowBlockedByRegion = createSelector(
  selectIsKycProhibitedRegion,
  selectKycRequestStatus,
  (isProhibited, status) => isProhibited && status === EKycRequestStatus.DRAFT,
);

export const selectCombinedBeneficialOwnerOwnership = (state: DeepReadonly<IKycState>): number => {
  if (state.beneficialOwners.length === 0) return 0;
  return state.beneficialOwners.reduce(
    (all, owner) => all + (owner.ownership ? owner.ownership : 0),
    0,
  );
};

export const selectKycIsLoading = (state: TAppGlobalState): boolean => state.kyc.statusLoading;

export const selectKycIsInitialLoading = createSelector(
  selectKycStatus,
  selectKycIsLoading,
  (status, isLoading) => status === undefined && isLoading,
);

export const selectWidgetError = (state: DeepReadonly<IKycState>): string | undefined =>
  state.statusError;

export const selectIndividualClientName = (state: TAppGlobalState) => {
  const data = state.kyc.individualData;

  return data ? [data.firstName, data.lastName].filter(Boolean).join(" ") : undefined;
};

export const selectBusinessClientName = (state: TAppGlobalState) =>
  state.kyc.businessData && state.kyc.businessData.name;

export const selectClientName = (state: TAppGlobalState) =>
  selectBusinessClientName(state) || selectIndividualClientName(state);

export const selectIndividualClientCountry = ({ kyc }: TAppGlobalState) =>
  kyc.individualData && kyc.individualData.country;

export const selectBusinessClientCountry = ({ kyc }: TAppGlobalState) =>
  kyc.businessData && kyc.businessData.country;

export const selectClientCountry = (state: TAppGlobalState) =>
  selectIndividualClientCountry(state) || selectBusinessClientCountry(state);

export const selectClientJurisdiction = createSelector(
  selectKyc,
  (state: DeepReadonly<IKycState>) =>
    // @SEE https://github.com/Neufund/platform-frontend/issues/2789#issuecomment-489081031
    (state.businessData && state.businessData.jurisdiction) ||
    (state.individualData && state.individualData.country),
);

export const selectIndividualAddress = createSelector(
  selectKyc,
  (state: DeepReadonly<IKycState>) => {
    if (state.individualData) {
      return {
        street: state.individualData.street,
        city: state.individualData.city,
        zipCode: state.individualData.zipCode,
        country: state.individualData.country,
        usState: state.individualData.usState,
      };
    }

    return undefined;
  },
);

export const selectClaims = (state: TAppGlobalState) => state.kyc.claims;

export const selectIsClaimsVerified = createSelector(selectClaims, claims => {
  if (claims) {
    return claims.isVerified;
  }

  return false;
});

export const selectIsAccountFrozen = createSelector(selectClaims, claims => {
  if (claims) {
    return claims.isAccountFrozen;
  }

  return false;
});

export const selectIsUserVerifiedOnBlockchain = (state: TAppGlobalState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);

export const selectBankAccount = (state: TAppGlobalState): DeepReadonly<TBankAccount> | undefined =>
  state.kyc.bankAccount;

export const selectIsBankAccountLoading = (state: TAppGlobalState): boolean =>
  state.kyc.bankAccount === undefined;

export const selectQuintessenceBankAccount = (
  state: TAppGlobalState,
): DeepReadonly<KycBankQuintessenceBankAccount> | undefined => state.kyc.quintessenceBankAccount;

export const selectKycSupportedInstantIdProviders = createSelector(
  selectKycStatus,
  kycStatus => kycStatus && kycStatus.supportedInstantIdProviders,
);
export const selectKycRecommendedInstantIdProvider = createSelector(
  selectKycStatus,
  kycStatus => kycStatus && kycStatus.recommendedInstantIdProvider,
);

export const selectKycInstantIdProvider = createSelector(
  selectKycStatus,
  kycStatus => kycStatus && kycStatus.instantIdProvider,
);

export const selectBeneficialOwner = (state: TAppGlobalState): IBeneficialOwnerStateProps => {
  let editingOwner;
  let files: ReadonlyArray<IKycFileInfo> = [];
  const editingBeneficialOwnerId = state.kyc.editingBeneficialOwnerId;
  let filesLoading = false;
  let filesUploading = false;

  if (editingBeneficialOwnerId) {
    editingOwner = state.kyc.beneficialOwners.find(
      item => getBeneficialOwnerId(item) === editingBeneficialOwnerId,
    );
    files = state.kyc.beneficialOwnerFiles[editingBeneficialOwnerId] || [];
    filesLoading = state.kyc.beneficialOwnerFilesLoading[editingBeneficialOwnerId];
    filesUploading = selectBeneficialOwnerFilesUploading(state, editingBeneficialOwnerId);
  }

  return {
    beneficialOwners: state.kyc.beneficialOwners,
    editingOwner,
    loading: !!state.kyc.loadingBeneficialOwners || !!state.kyc.loadingBeneficialOwner,
    files,
    filesLoading,
    filesUploading,
    showModal: state.kyc.showBeneficialOwnerModal,
    editingOwnerId: state.kyc.editingBeneficialOwnerId,
    loadingAll: state.kyc.loadingBeneficialOwners,
    loadingOne: state.kyc.loadingBeneficialOwner,
  };
};

export const selectEditingBeneficiaryId = (state: TAppGlobalState): string | undefined =>
  state.kyc.editingBeneficialOwnerId;

export const selectBusinessData = (state: TAppGlobalState): IBusinessDataStateProps => ({
  currentValues: state.kyc.businessData,
  loadingData: !!state.kyc.businessDataLoading,
  files: state.kyc.businessFiles,
  filesLoading: !!state.kyc.businessFilesLoading,
  filesUploading: selectBusinessFilesUploading(state),
});

export const selectLegalRepresentative = (state: TAppGlobalState): ILegalRepresentativeProps => ({
  legalRepresentative: state.kyc.legalRepresentative,
  loadingData: !!state.kyc.legalRepresentativeLoading,
  files: state.kyc.legalRepresentativeFiles,
  filesLoading: !!state.kyc.legalRepresentativeFilesLoading,
  filesUploading: selectLegalRepFilesUploading(state),
  showModal: state.kyc.showLegalRepresentativeModal,
});

export const selectManagingDirector = (state: TAppGlobalState): IManagingDirectorProps => ({
  currentValues: state.kyc.managingDirector,
  dataLoading: state.kyc.managingDirectorLoading,
  files: state.kyc.managingDirectorFiles || [],
  filesLoading: state.kyc.managingDirectorFilesLoading,
  filesUploading: state.kyc.managingDirectorFilesUploadingCount > 0,
  showModal: state.kyc.showManagingDirectorModal,
});
