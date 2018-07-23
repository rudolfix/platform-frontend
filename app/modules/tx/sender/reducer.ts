import { AppReducer } from "../../../store";

export type TxSenderType = "WITHDRAW";
export type TxSenderState =
  | "UNINITIALIZED"
  | "INIT"
  | "SUMMARY"
  | "ACCESSING_WALLET"
  | "SIGNING"
  | "MINING"
  | "DONE"
  | "ERROR_SIGN"
  | "REVERTED";

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
  blockId?: number;
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
        ...initialState,
      };

    case "TX_SENDER_ERROR":
      return {
        ...initialState,
        state: "ERROR_SIGN",
      };

    case "TX_SENDER_ACCEPT_DRAFT":
      return {
        ...state,
        state: "SUMMARY",
        txDetails: {
          ...state.txDetails,
          ...action.payload,
        },
      };

    case "TX_SENDER_ACCEPT":
      return {
        ...state,
        state: "ACCESSING_WALLET",
      };

    case "TX_SENDER_WALLET_PLUGGED":
      return {
        ...state,
        state: "SIGNING",
      };

    case "TX_SENDER_SIGNED":
      return {
        ...state,
        state: "MINING",
      };

    case "TX_SENDER_REPORT_BLOCK":
      return {
        ...state,
        blockId: action.payload,
      };

    case "TX_SENDER_TX_MINED":
      return {
        ...state,
        state: "DONE",
      };
  }

  return state;
};
