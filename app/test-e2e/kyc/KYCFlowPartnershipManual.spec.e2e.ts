import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser, DEFAULT_PASSWORD } from "../utils/userHelpers";
import { personData, businessData } from "./fixtures";
import {
  submitBusinessKYCForm,
  submitLegalRepresentationForm,
  uploadBusinessSupportingDocumentsAndSubmitForm,
  uploadLegalRepSupportingDocuments,
  acceptWallet,
} from "./forms";

const goToCorporationFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-company")).click();
  cy.get(tid("kyc-start-business-go-to-partnership")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);
};

const submitLegalRepresentativeForm = () => {
  cy.get(tid("kyc-company-legal-representative-upload-and-submit")).click();
};

describe("KYC Small Business flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC Small Business flow", () => {
    goToCorporationFlow();
    submitBusinessKYCForm(businessData);
    uploadBusinessSupportingDocumentsAndSubmitForm();
    submitLegalRepresentationForm(personData);
    uploadLegalRepSupportingDocuments();
    submitLegalRepresentativeForm();
    acceptWallet();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
