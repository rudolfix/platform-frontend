import { ReactNode } from "react";

import { AppReducer } from "../../../store";
import { EthereumAddress } from "../../../types";
import { TxData } from "web3";

export type TxSenderType = "WITHDRAW";
export type TxSenderState = "UNINITIALIZED" | "INIT" | "SUMMARY" | "MINING" | "DONE" | "REVERTED";

export interface ITxData {
  to?: string;
  value?: number | string;
  gas?: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number;
  from?: string;
}

export interface ITxSenderState {
  state: TxSenderState;
  type?: TxSenderType;
  txDetails?: ITxData;
}

const initialState: ITxSenderState = {
  state: "UNINITIALIZED",
};

export const txSenderReducer: AppReducer<ITxSenderState> = (
  state = initialState,
  action,
): ITxSenderState => {
  switch (action.type) {
    case "TX_SENDER_SHOW_MODAL":
      return {
        ...state,
        state: "INIT",
        type: action.payload.type,
      };

    case "TX_SENDER_HIDE_MODAL":
      return {
        ...initialState
      };

    case "TX_SENDER_CONFIRM":
      return {
        ...state,
        state: "SUMMARY",
        txDetails: {
          ...state.txDetails,
          ...action.payload,
        },
      };
  }

  return state;
};
