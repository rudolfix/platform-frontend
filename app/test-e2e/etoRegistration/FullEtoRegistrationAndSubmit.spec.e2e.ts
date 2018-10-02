import { createAndLoginNewUser } from "../utils/userHelpers";
import { tid, assertEtoDashboard } from "../utils";
import { fillForm } from "../utils/forms";
import {
  aboutForm,
  legalInfoForm,
  investmentTermsForm,
  etoTermsForm,
  etoKeyIndividualsForm,
  productVisionForm,
  mediaForm,
  riskForm,
  equityTokenInfoForm,
  votingRights,
} from "./fixtures";

describe("Eto Forms", () => {
  beforeEach(() => createAndLoginNewUser({ type: "issuer", kyc: "business" }));
  it("will fill and submit them all", () => {
    cy.visit("/dashboard");
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-about", "button")).click();
    fillForm(aboutForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-legal-info", "button")).click();
    fillForm(legalInfoForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-investment-terms", "button")).click();
    fillForm(investmentTermsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-eto-terms", "button")).click();
    fillForm(etoTermsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-key-individuals", "button")).click();
    // first click on all the add buttons to open the fields
    cy.get(tid("key-individuals-group-button-advisors")).click();
    cy.get(tid("key-individuals-group-button-keyAlliances")).click();
    cy.get(tid("key-individuals-group-button-boardMembers")).click();
    cy.get(tid("key-individuals-group-button-notableInvestors")).click();
    cy.get(tid("key-individuals-group-button-keyCustomers")).click();
    cy.get(tid("key-individuals-group-button-partners")).click();
    fillForm(etoKeyIndividualsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-product-vision", "button")).click();
    fillForm(productVisionForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-media", "button")).click();
    fillForm(mediaForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-risk-assessment", "button")).click();
    fillForm(riskForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-equity-token-info", "button")).click();
    fillForm(equityTokenInfoForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-voting-right", "button")).click();
    fillForm(votingRights);
    assertEtoDashboard();
  });
});
