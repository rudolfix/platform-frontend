import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IIcbmWalletBalanceModal {
  isOpen: boolean;
  address: string;
}

export interface ISendEthModalState {
  isOpen: boolean;
  sendEthModalObj?: IIcbmWalletBalanceModal;
}

const initialState: IIcbmWalletBalanceModal = {
  isOpen: false,
  address: "",
};

export const icbmWalletBalanceModalReducer: AppReducer<IIcbmWalletBalanceModal> = (
  state = initialState,
  action,
): DeepReadonly<IIcbmWalletBalanceModal> => {
  switch (action.type) {
    case "ICBM_WALLET_BALANCE_MODAL_SHOW":
      return {
        isOpen: true,
        address: action.payload.address,
      };
    case "ICBM_WALLET_BALANCE_MODAL_HIDE":
      return {
        isOpen: false,
        address: action.payload.address,
      };
    default:
      return state;
  }
};
