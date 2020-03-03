import { fillForm } from "../../../utils/forms";
import { goToIssuerDashboard } from "../../../utils/navigation";
import { tid } from "../../../utils/selectors";
import { createAndLoginNewUser } from "../../../utils/userHelpers";
import { fillAndAssertFull } from "../EtoRegistrationUtils";
import { etoKeyIndividualsForm, etoKeyIndividualsFormSubmit } from "../fixtures";

describe("Key Individuals", () => {
  before(() => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    goToIssuerDashboard();
  });

  it("should submit form without changes @eto @p3", () => {
    fillAndAssertFull("eto-progress-widget-key-individuals", etoKeyIndividualsFormSubmit);
  });

  it("should fill and submit key individuals @eto @p3", () => {
    fillAndAssertFull("eto-progress-widget-key-individuals", () => {
      cy.get(tid("key-individuals-group-button-team")).click();
      cy.get(tid("key-individuals-group-button-advisors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyAlliances")).awaitedClick();
      cy.get(tid("key-individuals-group-button-boardMembers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-notableInvestors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyCustomers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-partners")).awaitedClick();
      fillForm(etoKeyIndividualsForm);
    });
  });
});
