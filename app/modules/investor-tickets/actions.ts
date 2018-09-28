import { createAction, createSimpleAction } from "../actionsUtils";
import { IInvestorTicket } from "./types";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (etoId: string) => createAction("INVESTOR_TICKET_LOAD", { etoId }),
  loadEtosWithInvestorTickets: () => createSimpleAction("INVESTOR_TICKET_ETOS_LOAD"),
  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),

  // state mutations
  setEtoInvestorTicket: (etoId: string, ticket: IInvestorTicket) =>
    createAction("INVESTOR_TICKET_SET", { etoId, ticket }),
};
