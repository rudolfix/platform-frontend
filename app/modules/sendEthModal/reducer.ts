import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface ISendEthModal {
  isOpen: boolean;
}

export interface ISendEthModalState {
  isOpen: boolean;
  sendEthModalObj?: ISendEthModal;
}

const initialState: ISendEthModalState = {
  isOpen: false,
};

export const sendEthModalReducer: AppReducer<ISendEthModalState> = (
  state = initialState,
  action,
): DeepReadonly<ISendEthModalState> => {
  switch (action.type) {
    case "SEND_ETH_MODAL_SHOW":
      return {
        isOpen: true,
      };
    case "SEND_ETH_MODAL_HIDE":
      return {
        isOpen: false,
      };
    default:
      return state;
  }
};
