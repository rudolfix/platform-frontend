import { DeepReadonly } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { authModuleAPI } from "../auth/module";
import {
  EKycRequestStatus,
  IKycFileInfo,
  KycBankQuintessenceBankAccount,
} from "./lib/http/kyc-api/KycApi.interfaces";
import { TKycModuleState } from "./module";
import { IKycState } from "./reducer";
import {
  IBeneficialOwnerStateProps,
  IBusinessDataStateProps,
  ILegalRepresentativeProps,
  IManagingDirectorProps,
  TBankAccount,
} from "./types";
import { getBeneficialOwnerId } from "./utils";

export const selectKyc = (state: TKycModuleState) => state.kyc;

export const selectKycStatus = createSelector(selectKyc, kyc => kyc.status);

export const selectIsKycProhibitedRegion = createSelector(
  selectKycStatus,
  status => !!status && status.inProhibitedRegion,
);

export const selectKycRequestType = createSelector(
  selectKycStatus,
  status => status && status.type,
);

export const selectIndividualData = (state: TKycModuleState) => state.kyc.individualData;
export const selectIndividualDataLoading = (state: TKycModuleState) =>
  !!state.kyc.individualDataLoading;
export const selectIsSavingKycForm = (state: TKycModuleState) => !!state.kyc.kycSaving;

export const selectIndividualFiles = (state: TKycModuleState) => state.kyc.individualFiles;
export const selectIndividualFilesLoading = (state: TKycModuleState) =>
  state.kyc.individualFilesLoading;
export const selectIndividualFilesUploading = (state: TKycModuleState): boolean =>
  state.kyc.individualFilesUploadingCount > 0;

export const selectBusinessFiles = (state: TKycModuleState) => state.kyc.businessFiles;
export const selectBusinessFilesUploading = (state: TKycModuleState): boolean =>
  state.kyc.businessFilesUploadingCount > 0;

export const selectLegalRepFiles = (state: TKycModuleState) => state.kyc.legalRepresentativeFiles;
export const selectLegalRepFilesUploading = (state: TKycModuleState): boolean =>
  state.kyc.legalRepresentativeFilesUploadingCount > 0;

export const selectBeneficialOwnerFilesUploading = (
  state: TKycModuleState,
  fileId: string,
): boolean => state.kyc.beneficialOwnerFilesUploadingCount[fileId] > 0;

export const selectKycUploadedFiles = (state: TKycModuleState) =>
  selectIndividualFiles(state) || selectBusinessFiles(state) || selectLegalRepFiles(state);

export const selectKycRequestStatus = (state: TKycModuleState): EKycRequestStatus | undefined => {
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

export const selectKycIsLoading = (state: TKycModuleState): boolean => state.kyc.statusLoading;

export const selectKycIsInitialLoading = createSelector(
  selectKycStatus,
  selectKycIsLoading,
  (status, isLoading) => status === undefined && isLoading,
);

export const selectWidgetError = (state: DeepReadonly<IKycState>): string | undefined =>
  state.statusError;

export const selectIndividualClientName = (state: TKycModuleState) => {
  const data = state.kyc.individualData;

  return data ? [data.firstName, data.lastName].filter(Boolean).join(" ") : undefined;
};

export const selectBusinessClientName = (state: TKycModuleState) => state.kyc.businessData?.name;

export const selectClientName = (state: TKycModuleState) =>
  selectBusinessClientName(state) || selectIndividualClientName(state);

export const selectIndividualClientCountry = ({ kyc }: TKycModuleState) =>
  kyc.individualData && kyc.individualData.country;

export const selectBusinessClientCountry = ({ kyc }: TKycModuleState) =>
  kyc.businessData && kyc.businessData.country;

export const selectClientCountry = (state: TKycModuleState) =>
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

export const selectClaims = (state: TKycModuleState) => state.kyc.claims;

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

export const selectIsUserVerified = (state: TKycModuleState): boolean =>
  authModuleAPI.selectors.selectIsUserEmailVerified(state) &&
  selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED;

export const selectIsUserVerifiedOnBlockchain = (state: TKycModuleState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);

export const selectBankAccount = (state: TKycModuleState): DeepReadonly<TBankAccount> | undefined =>
  state.kyc.bankAccount;

export const selectIsBankAccountLoading = (state: TKycModuleState): boolean =>
  state.kyc.bankAccount === undefined;

export const selectQuintessenceBankAccount = (
  state: TKycModuleState,
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

export const selectBeneficialOwner = (state: TKycModuleState): IBeneficialOwnerStateProps => {
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

export const selectEditingBeneficiaryId = (state: TKycModuleState): string | undefined =>
  state.kyc.editingBeneficialOwnerId;

export const selectBusinessData = (state: TKycModuleState): IBusinessDataStateProps => ({
  currentValues: state.kyc.businessData,
  loadingData: !!state.kyc.businessDataLoading,
  files: state.kyc.businessFiles,
  filesLoading: !!state.kyc.businessFilesLoading,
  filesUploading: selectBusinessFilesUploading(state),
});

export const selectLegalRepresentative = (state: TKycModuleState): ILegalRepresentativeProps => ({
  legalRepresentative: state.kyc.legalRepresentative,
  loadingData: !!state.kyc.legalRepresentativeLoading,
  files: state.kyc.legalRepresentativeFiles,
  filesLoading: !!state.kyc.legalRepresentativeFilesLoading,
  filesUploading: selectLegalRepFilesUploading(state),
  showModal: state.kyc.showLegalRepresentativeModal,
});

export const selectManagingDirector = (state: TKycModuleState): IManagingDirectorProps => ({
  currentValues: state.kyc.managingDirector,
  dataLoading: state.kyc.managingDirectorLoading,
  files: state.kyc.managingDirectorFiles || [],
  filesLoading: state.kyc.managingDirectorFilesLoading,
  filesUploading: state.kyc.managingDirectorFilesUploadingCount > 0,
  showModal: state.kyc.showManagingDirectorModal,
});
