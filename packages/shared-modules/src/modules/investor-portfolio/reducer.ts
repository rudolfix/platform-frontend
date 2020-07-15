import { AppReducer } from "@neufund/sagas";
import { DeepReadonly, Dictionary } from "@neufund/shared-utils";

import { investorPortfolioActions } from "./actions";
import {
  ICalculatedContribution,
  IIncomingPayouts,
  IInvestorTicket,
  TTokenDisbursalData,
  TTokensPersonalDiscount,
} from "./types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
  calculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  tokensDisbursal: TTokenDisbursalData;
  incomingPayouts: IIncomingPayouts;
  tokensPersonalDiscounts: Dictionary<TTokensPersonalDiscount | undefined>;
}

export const etoFlowInitialState: IInvestorTicketsState = {
  calculatedContributions: {},
  initialCalculatedContributions: {},
  investorEtoTickets: {},
  tokensDisbursal: {
    loading: false,
    error: false,
    data: undefined,
  },
  incomingPayouts: {
    loading: false,
    error: false,
    data: undefined,
  },
  tokensPersonalDiscounts: {},
};

export const investorPortfolioReducer: AppReducer<
  IInvestorTicketsState,
  typeof investorPortfolioActions
> = (state = etoFlowInitialState, action): DeepReadonly<IInvestorTicketsState> => {
  switch (action.type) {
    case investorPortfolioActions.setEtoInvestorTicket.getType():
      return {
        ...state,
        investorEtoTickets: {
          ...state.investorEtoTickets,
          [action.payload.etoId]: action.payload.ticket,
        },
      };
    case investorPortfolioActions.setCalculatedContribution.getType():
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case investorPortfolioActions.setInitialCalculatedContribution.getType():
      return {
        ...state,
        initialCalculatedContributions: {
          ...state.initialCalculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case investorPortfolioActions.loadClaimables.getType():
      return {
        ...state,
        tokensDisbursal: {
          ...state.tokensDisbursal,
          loading: true,
          error: false,
        },
      };
    case investorPortfolioActions.setTokensDisbursalError.getType():
      return {
        ...state,
        tokensDisbursal: {
          ...state.tokensDisbursal,
          loading: false,
          error: true,
        },
      };
    case investorPortfolioActions.setTokensDisbursal.getType():
      return {
        ...state,
        tokensDisbursal: {
          loading: false,
          error: false,
          data: action.payload.tokensDisbursal,
        },
      };
    case investorPortfolioActions.getIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: true,
          error: false,
        },
      };
    case investorPortfolioActions.setIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: false,
          error: false,
          data: action.payload.incomingPayouts,
        },
      };
    case investorPortfolioActions.setIncomingPayoutsError.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: false,
          error: true,
        },
      };
    case investorPortfolioActions.resetIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: true,
          error: false,
          data: undefined,
        },
      };

    case investorPortfolioActions.setTokenPersonalDiscount.getType():
      return {
        ...state,
        tokensPersonalDiscounts: {
          ...state.tokensPersonalDiscounts,
          [action.payload.etoId]: action.payload.tokenPersonalDiscount,
        },
      };
  }

  return state;
};

const investorPortfolioReducerMap = {
  investorPortfolio: investorPortfolioReducer,
};

export { investorPortfolioReducerMap };
