import { DeepReadonly } from "@neufund/shared-utils";
import { AppReducer } from "@neufund/sagas";
import { actions } from "./actions";

export type TShareholderResolutionsVotingSetupState = {
  uploadingDocument: boolean;
  showSuccessModal: boolean;
};

const initialState: TShareholderResolutionsVotingSetupState = {
  uploadingDocument: false,
  showSuccessModal: false,
};

export const reducer: AppReducer<TShareholderResolutionsVotingSetupState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<TShareholderResolutionsVotingSetupState> => {
  switch (action.type) {
    case actions.uploadResolutionDocument.getType():
      return {
        ...state,
        uploadingDocument: true,
      };
    case actions.uploadResolutionDocumentSuccess.getType():
      return {
        ...state,
        uploadingDocument: false,
      };
    case actions.uploadResolutionDocumentError.getType():
      return {
        ...state,
        uploadingDocument: false,
      };
    case actions.setShareCapital.getType():
      return {
        ...state,
        shareCapital: action.payload.shareCapital,
      };
    case actions.showSuccessModal.getType():
      return {
        ...state,
        showSuccessModal: true,
      };
    case actions.closeSuccessModal.getType():
      return {
        ...state,
        showSuccessModal: false,
      };
    default:
      return state;
  }
};

export const shareholderResolutionsVotingSetupReducerMap = {
  shareholderResolutionsVotingSetup: reducer,
};
