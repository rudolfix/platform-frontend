import { compareBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import {
  EInvestmentCurrency,
  EInvestmentType,
  IInvestmentFlowState,
} from "./reducer";

// State Selectors

export const selectEthValueUlps = (state: IInvestmentFlowState) => state.ethValueUlps;

export const selectEurValueUlps = (state: IInvestmentFlowState) => state.euroValueUlps;

export const selectErrorState = (state: IInvestmentFlowState) => state.errorState;

export const selectInvestmentType = (state: IInvestmentFlowState) => state.investmentType;

// Derived Values

export const selectIsICBMInvestment = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.ICBMEth ||
  state.investmentType === EInvestmentType.ICBMnEuro;

export const selectInvestmentGasCostEth = (state: IInvestmentFlowState) =>
  multiplyBigNumbers([state.gasPrice, state.gasAmount]);

export const selectReadyToInvest = (state: IInvestmentFlowState) =>
  !!(
    state.euroValueUlps &&
    state.isValidatedInput &&
    !state.errorState &&
    state.gasPrice &&
    compareBigNumbers(state.euroValueUlps, 0) > 0 &&
    compareBigNumbers(state.gasPrice, 0) > 0
  );

export const selectCurrencyByInvestmentType = (state: IInvestmentFlowState) =>
  state.investmentType === EInvestmentType.InvestmentWallet ||
  state.investmentType === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;
