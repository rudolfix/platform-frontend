import { fillAndAssertFull } from "../eto-registration/EtoRegistrationUtils";
import {
  aboutForm,
  equityTokenInfoForm,
  etoKeyIndividualsForm,
  etoTermsForm,
  investmentTermsForm,
  legalInfoForm,
  mediaForm,
  productVisionForm,
  votingRights,
} from "../eto-registration/fixtures";
import { assertEtoDashboard } from "../utils";
import { cyPromise } from "../utils/cyPromise";
import { fillForm } from "../utils/forms";
import { generateRandomSeedAndAddress } from "../utils/generateRandomSeedAndAddress";
import { goToEtoDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Eto Forms", () => {
  let generatedSeed: string;
  it("should login user correcty", function(): void {
    // TODO: Investigate the case where user sometimes doesn't have KYC this only happens on CI
    // Having tests that relay on each other is an anti pattern but this is a special case since the test
    // is very long Its better to retry on a smaller test that has a side effect to login as a real user
    this.retries(2);
    cyPromise(() => generateRandomSeedAndAddress("m/44'/60'/0'")).then(({ seed }) => {
      generatedSeed = seed.join(" ");
      createAndLoginNewUser({ type: "issuer", kyc: "business", seed: generatedSeed }).then(() => {
        goToEtoDashboard();
        cy.get(tid("eto-progress-widget-about")).should("exist");
      });
    });
  });
  it("will fill and submit them all", () => {
    createAndLoginNewUser({ type: "issuer", onlyLogin: true, seed: generatedSeed }).then(() => {
      goToEtoDashboard();

      cy.get(tid("eto-progress-widget-eto-terms")).should("not.exist");

      // Fill marketing data first

      fillAndAssertFull("eto-progress-widget-about", aboutForm);

      fillAndAssertFull("eto-progress-widget-legal-info", legalInfoForm);

      fillAndAssertFull("eto-progress-widget-equity-token-info", equityTokenInfoForm);

      fillAndAssertFull("eto-progress-widget-product-vision", productVisionForm);

      fillAndAssertFull("eto-progress-widget-media", mediaForm);

      cy.get(tid("eto-progress-widget-key-individuals", "button")).awaitedClick();
      // first click on all the add buttons to open the fields
      cy.get(tid("key-individuals-group-button-team")).click();
      cy.get(tid("key-individuals-group-button-advisors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyAlliances")).awaitedClick();
      cy.get(tid("key-individuals-group-button-boardMembers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-notableInvestors")).awaitedClick();
      cy.get(tid("key-individuals-group-button-keyCustomers")).awaitedClick();
      cy.get(tid("key-individuals-group-button-partners")).awaitedClick();
      fillForm(etoKeyIndividualsForm);
      assertEtoDashboard();
      cy.get(
        `${tid("eto-progress-widget-key-individuals")} ${tid("chart-circle.progress")}`,
      ).should("contain", "100%");

      // hidden for now as requested in #2633
      // fillAndAssertFull("eto-progress-widget-risk-assessment", riskForm);

      // Now eto settings should be available
      cy.get(tid("eto-progress-widget-eto-terms")).should("exist");

      // Fill eto settings

      fillAndAssertFull("eto-progress-widget-investment-terms", investmentTermsForm);

      fillAndAssertFull("eto-progress-widget-eto-terms", () => {
        fillForm(
          {
            productId: {
              value: "retail eto li security",
              type: "radio",
            },
          },
          { submit: false },
        );

        cy.get(tid("eto-flow-product-changed-successfully"));

        fillForm(etoTermsForm);
      });

      fillAndAssertFull("eto-progress-widget-voting-right", votingRights);
    });
  });
});
