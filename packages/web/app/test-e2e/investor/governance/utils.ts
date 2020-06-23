import { governanceProposalLink } from "../../../components/appRouteUtils";
import { tid } from "../../utils";

export const goToInvestorProposal = (proposalId: string) => {
  cy.visit(governanceProposalLink(proposalId));
};

export const assertInvestorProposal = () => {
  cy.get(tid("governance.investor-proposal")).should("exist");
};
