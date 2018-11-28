import { TMessage } from "../../components/translatedMessages/utils";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface ISignMessageModalState {
  isModalOpen: boolean;
  errorMessage?: DeepReadonly<TMessage>;
  modalTitle?: string;
  modalMessage?: string;
}

const initialState: ISignMessageModalState = {
  isModalOpen: false,
};

export const accessWalletReducer: AppReducer<ISignMessageModalState> = (
  state = initialState,
  action,
): ISignMessageModalState => {
  switch (action.type) {
    case "SHOW_ACCESS_WALLET_MODAL":
      return {
        ...state,
        isModalOpen: true,
        errorMessage: undefined,
        modalTitle: action.payload.title,
        modalMessage: action.payload.message,
      };
    case "HIDE_ACCESS_WALLET_MODAL":
      return {
        ...state,
        isModalOpen: false,
      };
    case "ACCESS_WALLET_SIGNING_ERROR":
      return {
        ...state,
        errorMessage: action.payload.errorMessage,
      };
    case "ACCESS_WALLET_CLEAR_SIGNING_ERROR":
    case "ACCESS_WALLET_ACCEPT":
      return {
        ...state,
        errorMessage: undefined,
      };
  }

  return state;
};

export const selectIsSigning = (state: ISignMessageModalState): boolean => state.isModalOpen;
