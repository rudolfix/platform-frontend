import { acceptWallet } from "../utils";
import { tid } from "../utils/selectors";

export const submitProposal = () => {
  cy.visit("/dashboard");

  cy.get(tid("eto-dashboard-submit-proposal")).click();
  acceptWallet();

  cy.get(tid("eto-state-pending")).should("exist");
};
