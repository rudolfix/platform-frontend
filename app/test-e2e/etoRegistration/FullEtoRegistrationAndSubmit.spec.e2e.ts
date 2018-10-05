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

    cy.get(tid("eto-progress-widget-about", "button")).awaitedClick();
    fillForm(aboutForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-legal-info", "button")).awaitedClick();
    fillForm(legalInfoForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-investment-terms", "button")).awaitedClick();
    fillForm(investmentTermsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-eto-terms", "button")).awaitedClick();
    fillForm(etoTermsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-key-individuals", "button")).awaitedClick();
    // first click on all the add buttons to open the fields
    cy.get(tid("key-individuals-group-button-advisors")).awaitedClick();
    cy.get(tid("key-individuals-group-button-keyAlliances")).awaitedClick();
    cy.get(tid("key-individuals-group-button-boardMembers")).awaitedClick();
    cy.get(tid("key-individuals-group-button-notableInvestors")).awaitedClick();
    cy.get(tid("key-individuals-group-button-keyCustomers")).awaitedClick();
    cy.get(tid("key-individuals-group-button-partners")).awaitedClick();
    fillForm(etoKeyIndividualsForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-product-vision", "button")).awaitedClick();
    fillForm(productVisionForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-media", "button")).awaitedClick();
    fillForm(mediaForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-risk-assessment", "button")).awaitedClick();
    fillForm(riskForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-equity-token-info", "button")).awaitedClick();
    fillForm(equityTokenInfoForm);
    assertEtoDashboard();

    cy.get(tid("eto-progress-widget-voting-right", "button")).awaitedClick();
    fillForm(votingRights);
    assertEtoDashboard();
  });
});
