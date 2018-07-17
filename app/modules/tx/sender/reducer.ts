import { ReactNode } from "react";

import { AppReducer } from "../../../store";

export type TxSenderType = "WITHDRAW";

export interface ITxSenderState {
  modalIsOpen: boolean;
  type?: TxSenderType;
}

const initialState: ITxSenderState = {
  modalIsOpen: false,
};

export const txSenderReducer: AppReducer<ITxSenderState> = (
  state = initialState,
  action,
): ITxSenderState => {
  switch (action.type) {
    case "TX_SENDER_SHOW_MODAL":
      return {
        ...state,
        modalIsOpen: true,
        type: action.payload.type,
      };
    case "TX_SENDER_HIDE_MODAL":
      return {
        ...state,
        type: undefined,
        modalIsOpen: false,
      };
  }

  return state;
};
