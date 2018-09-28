import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { IInvestorTicket } from "./types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
}

export const etoFlowInitialState: IInvestorTicketsState = {
  investorEtoTickets: {},
};

export const investorTicketsReducer: AppReducer<IInvestorTicketsState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IInvestorTicketsState> => {
  switch (action.type) {
    case "INVESTOR_TICKET_SET":
      return {
        ...state,
        investorEtoTickets: {
          ...state.investorEtoTickets,
          [action.payload.etoId]: action.payload.ticket,
        },
      };
  }

  return state;
};
