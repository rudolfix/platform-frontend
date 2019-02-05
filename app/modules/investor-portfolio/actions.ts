import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { Dictionary } from "../../types";
import { createAction, createActionFactory } from "../actionsUtils";
import { ICalculatedContribution, IInvestorTicket, ITokenDisbursal } from "./types";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (eto: TEtoSpecsData) => createAction("INVESTOR_TICKET_LOAD", { eto }),
  loadInvestorTickets: (etos: Dictionary<TEtoSpecsData>) =>
    createAction("INVESTOR_TICKET_ETOS_LOAD", { etos }),
  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),
  loadClaimables: createActionFactory("INVESTOR_CLAIMABLES_LOAD"),

  // state mutations
  setEtoInvestorTicket: (etoId: string, ticket: IInvestorTicket) =>
    createAction("INVESTOR_TICKET_SET", { etoId, ticket }),
  setCalculatedContribution: (etoId: string, contribution: ICalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setInitialCalculatedContribution: (etoId: string, contribution: ICalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_INITIAL_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setTokensDisbursal: createActionFactory(
    "SET_TOKENS_DISBURSAL",
    (tokensDisbursal: ITokenDisbursal[]) => ({ tokensDisbursal }),
  ),
};
