import { governanceProposalLink } from "../../../components/appRouteUtils";
import { tid } from "../../utils";

export const goToIssuerProposal = (proposalId: string) => {
  cy.visit(governanceProposalLink(proposalId));
};

export const assertIssuerProposal = () => {
  cy.get(tid("governance.issuer-proposal")).should("exist");
};
