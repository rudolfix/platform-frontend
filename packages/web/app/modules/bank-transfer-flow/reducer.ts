import { DeepReadonly } from "@neufund/shared-utils";

import { AppReducer } from "../../store";
import { actions } from "../actions";

export enum EBankTransferFlowState {
  UNINITIALIZED = "uninitialized",
  PROCESSING = "processing",
  AGREEMENT = "agreement",
  SUMMARY = "summary",
  SUCCESS = "success",
}

export enum EBankTransferType {
  PURCHASE,
  VERIFY,
}

export interface IBankTransferState {
  state: EBankTransferFlowState;
  type: EBankTransferType | undefined;
  minEuro: string;
  reference: string;
  bankFee: string;
  redeem?: {
    minEuro: string;
    bankFee: string;
  };
}

export const bankTransferInitialState: IBankTransferState = {
  state: EBankTransferFlowState.UNINITIALIZED,
  type: undefined,
  minEuro: "",
  reference: "",
  bankFee: "",
};

export const bankTransferFlowReducer: AppReducer<IBankTransferState> = (
  state = bankTransferInitialState,
  action,
): DeepReadonly<IBankTransferState> => {
  switch (action.type) {
    case actions.bankTransferFlow.startBankTransfer.getType():
    case actions.bankTransferFlow.continueProcessing.getType():
      return {
        ...state,
        state: EBankTransferFlowState.PROCESSING,
      };

    case actions.bankTransferFlow.setTransferDetails.getType():
      return {
        ...state,
        reference: action.payload.reference,
        minEuro: action.payload.minEuro,
        type: action.payload.type,
      };

    case actions.bankTransferFlow.continueToAgreement.getType():
      return {
        ...state,
        state: EBankTransferFlowState.AGREEMENT,
      };

    case actions.bankTransferFlow.continueToSummary.getType():
      return {
        ...state,
        state: EBankTransferFlowState.SUMMARY,
      };
    case actions.bankTransferFlow.continueToSuccess.getType():
      return {
        ...state,
        state: EBankTransferFlowState.SUCCESS,
      };
    case actions.bankTransferFlow.setRedeemData.getType():
      return {
        ...state,
        redeem: {
          minEuro: action.payload.redeemMinEuro,
          bankFee: action.payload.redeemBankFee,
        },
      };

    case actions.bankTransferFlow.stopBankTransfer.getType():
      return {
        redeem: state.redeem,
        ...bankTransferInitialState,
      };
  }

  return state;
};
