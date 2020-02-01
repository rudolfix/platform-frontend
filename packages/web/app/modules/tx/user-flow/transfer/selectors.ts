import { EquityToken, toEquityTokenSymbol } from "@neufund/shared";
import { createSelector } from "reselect";

import { IAppState } from "../../../../store";
import { TxUserFlowInputData, TxUserFlowTransferDetails } from "./types";

export type TSelectUserFlowDetails = Required<TxUserFlowTransferDetails>;

export const selectUserFlowTxDetails = (state: IAppState): TSelectUserFlowDetails => {
  const txUserFlowDetails = state.txUserFlowTransfer.txUserFlowDetails;
  return {
    transferAllValue: txUserFlowDetails.transferAllValue || "0",
    inputValue: txUserFlowDetails.inputValue,
    inputValueEuro: txUserFlowDetails.inputValueEuro,
    inputTo: txUserFlowDetails.inputTo || "0x",
    totalValue: txUserFlowDetails.totalValue,
    totalValueEur: txUserFlowDetails.totalValueEur,
    transactionCost: txUserFlowDetails.transactionCost,
    transactionCostEur: txUserFlowDetails.transactionCostEur,
  };
};

export const selectUserFlowUserBalance = (state: IAppState): string =>
  state.txUserFlowTransfer.txUserTokenData.userBalance;

export const selectUserFlowTokenImage = (state: IAppState): string =>
  state.txUserFlowTransfer.txUserTokenData.tokenImage;

export const selectUserFlowTokenSymbol = (state: IAppState): EquityToken =>
  toEquityTokenSymbol(state.txUserFlowTransfer.txUserTokenData.tokenSymbol);

export const selectUserFlowTxInput = (state: IAppState): TxUserFlowInputData =>
  state.txUserFlowTransfer.txUserFlowInputData;

export const selectUserFlowTokenAddress = (state: IAppState) =>
  state.txUserFlowTransfer.txUserTokenData.tokenAddress;

export const selectUserFlowTokenDecimals = (state: IAppState) =>
  state.txUserFlowTransfer.txUserTokenData.tokenDecimals;

export const selectUserFlowTokenData = createSelector(
  selectUserFlowTokenImage,
  selectUserFlowTokenSymbol,
  selectUserFlowTokenDecimals,
  (tokenImage, tokenSymbol, tokenDecimals) => ({
    tokenImage,
    tokenSymbol,
    tokenDecimals,
  }),
);
