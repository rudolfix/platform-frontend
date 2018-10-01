import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser, DEFAULT_PASSWORD } from "../utils/userHelpers";
import { personData } from "./fixtures";
import { submitIndividualKYCForm, uploadFileToFieldWithTid, acceptWallet } from "./forms";

const goToIndividualKYCFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-personal")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);
};

const goToIndividualManualVerification = () => {
  cy.get(tid("kyc-go-to-manual-verification")).click();
  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);
};

const uploadDocumentAndSubmitForm = () => {
  uploadFileToFieldWithTid("kyc-personal-upload-dropzone");
  cy.get(tid("kyc-personal-upload-submit")).click();
};

describe("KYC Personal flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC flow with personal data", () => {
    goToIndividualKYCFlow();
    submitIndividualKYCForm(personData);
    goToIndividualManualVerification();
    uploadDocumentAndSubmitForm();
    acceptWallet();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);
    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending"));
  });
});
