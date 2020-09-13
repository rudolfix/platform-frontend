import { TAppGlobalState } from "../../store";

const selectShareholderResolutionsVotingSetupModule = (state: TAppGlobalState) =>
  state.shareholderResolutionsVotingSetup;

export const isDocumentUploading = (state: TAppGlobalState) =>
  selectShareholderResolutionsVotingSetupModule(state).uploadingDocument;

export const selectUploadedDocument = (state: TAppGlobalState) =>
  selectShareholderResolutionsVotingSetupModule(state).uploadedDocument;

export const selectShareCapital = (state: TAppGlobalState) =>
  selectShareholderResolutionsVotingSetupModule(state).shareCapital;

export const selectShowSuccessModal = (state: TAppGlobalState) =>
  selectShareholderResolutionsVotingSetupModule(state).showSuccessModal;