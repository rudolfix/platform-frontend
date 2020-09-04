import { TAppGlobalState } from "../../store";

const selectShareholderResolutionsVotingSetupModule = (state: TAppGlobalState) =>
  state.shareholderResolutionsVotingSetup;

export const isDocumentUploading = (state: TAppGlobalState) =>
  selectShareholderResolutionsVotingSetupModule(state).uploadingDocument;
