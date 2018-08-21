import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export enum EInvestmentType {
  None = "NONE",
  InvestmentWallet = "INVESTMENT_WALLET",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEURO",
  BankTransfer = "BANK_TRANSFER"
}

export interface IInvestmentFlowState {
  investmentSelection: EInvestmentType
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  investmentSelection: EInvestmentType.None
};

export const investmentFlowModalReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...state,
        investmentSelection: action.payload.type
      };
  }

  return state;
};
