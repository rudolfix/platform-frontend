import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IWalletStateData } from "./../wallet/reducer";

export interface IIcbmWalletBalanceModal {
  isOpen: boolean;
  loading: boolean;
  ethAddress?: string;
  migrationWalletData?: IWalletStateData;
}

export interface ISendEthModalState {
  isOpen: boolean;
  sendEthModalObj?: IIcbmWalletBalanceModal;
}

const initialState: IIcbmWalletBalanceModal = {
  isOpen: false,
  loading: false,
};

export const icbmWalletBalanceModalReducer: AppReducer<IIcbmWalletBalanceModal> = (
  state = initialState,
  action,
): DeepReadonly<IIcbmWalletBalanceModal> => {
  switch (action.type) {
    case "ICBM_WALLET_BALANCE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_HIDE":
      return {
        ...state,
        isOpen: false,
      };
    case "ICBM_WALLET_BALANCE_MODAL_GET_WALLET_DATA":
      return {
        ...state,
        ethAddress: action.payload.ethAddress,
        loading: true,
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA":
      return {
        ...state,
        loading: false,
        migrationWalletData: action.payload.data,
      };
    default:
      return state;
  }
};
