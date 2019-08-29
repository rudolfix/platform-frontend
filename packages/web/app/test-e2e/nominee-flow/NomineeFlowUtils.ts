import { tid } from "../utils";
import { goToNomineeDashboard } from "../utils/navigation";

export const linkEtoToNominee = (address: string) => {
  goToNomineeDashboard();

  cy.get(tid("nominee-flow.link-with-issuer-input")).type(address);

  cy.get(tid("nominee-flow.link-with-issuer-submit")).click();

  cy.get(tid("nominee-request-pending")).should("exist");
};
