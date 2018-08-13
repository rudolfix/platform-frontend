import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IWalletStateData } from "../wallet/reducer";

export interface IIcbmWalletBalanceModal {
  isOpen: boolean;
  ethAddress?: string;
  walletData?: Partial<IWalletStateData>;
}

export interface ISendEthModalState {
  isOpen: boolean;
  sendEthModalObj?: IIcbmWalletBalanceModal;
}

const initialState: IIcbmWalletBalanceModal = {
  isOpen: false,
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
      };
    case "ICBM_WALLET_BALANCE_MODAL_LOAD_WALLET_DATA":
      return {
        ...state,
        walletData: action.payload.data,
      };
    default:
      return state;
  }
};
