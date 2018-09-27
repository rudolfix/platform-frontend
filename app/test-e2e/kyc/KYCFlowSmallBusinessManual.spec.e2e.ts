import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser, DEFAULT_PASSWORD } from "../utils/userHelpers";
import { personData, businessData } from "./fixtures";
import {
  submitLegalRepresentationForm,
  submitBusinessKYCForm,
  uploadBusinessSupportingDocumentsAndSubmitForm,
  acceptWallet,
  uploadLegalRepSupportingDocuments,
} from "./forms";

const goToSmallBusinessFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-company")).click();
  cy.get(tid("kyc-start-company-go-to-small-business")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);
};

describe("KYC Small Business flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC Small Business flow", () => {
    goToSmallBusinessFlow();
    submitBusinessKYCForm(businessData);
    uploadBusinessSupportingDocumentsAndSubmitForm();
    submitLegalRepresentationForm(personData);
    uploadLegalRepSupportingDocuments();
    cy.get(tid("kyc-company-legal-representative-upload-and-submit")).click();
    acceptWallet();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
