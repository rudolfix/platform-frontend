import { compareBigNumbers } from "@neufund/shared-utils";

import { TAppGlobalState } from "../../store";
import { EValidationState } from "../tx/validator/reducer";
import { selectTxValidationState } from "../tx/validator/selectors";
import { EInvestmentType } from "./reducer";

// State Selectors

export const selectInvestmentEthValueUlps = (state: TAppGlobalState) =>
  state.investmentFlow.ethValueUlps;

export const selectInvestmentEurValueUlps = (state: TAppGlobalState) =>
  state.investmentFlow.euroValueUlps;

export const selectInvestmentErrorState = (state: TAppGlobalState) =>
  state.investmentFlow.errorState;

export const selectInvestmentType = (state: TAppGlobalState) => state.investmentFlow.investmentType;

export const selectInvestmentEtoId = (state: TAppGlobalState) => state.investmentFlow.etoId;

export const selectIsInvestmentInputValidated = (state: TAppGlobalState) =>
  state.investmentFlow.isValidatedInput;

export const selectWallets = (state: TAppGlobalState) => state.investmentFlow.wallets;

// Derived Values

export const selectIsICBMInvestment = (state: TAppGlobalState) => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.ICBMEth || type === EInvestmentType.ICBMnEuro;
};

export const selectIsReadyToInvest = (state: TAppGlobalState) => {
  const ethValue = selectInvestmentEthValueUlps(state);

  return !!(
    ethValue &&
    !selectInvestmentErrorState(state) &&
    selectIsInvestmentInputValidated(state) &&
    compareBigNumbers(ethValue, "0") > 0 &&
    selectTxValidationState(state) === EValidationState.VALIDATION_OK
  );
};
