import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { personData } from "./fixtures";
import { submitIndividualKYCForm } from "./forms";
import { uploadFileToFieldWithTid } from "../utils/forms";

const goToIndividualKYCFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-personal")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);
};

const goToIndividualOutsourcedVerification = () => {
  cy.get(tid("kyc-go-to-outsourced-verification")).click();
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
    goToIndividualOutsourcedVerification();

    // we should now be on the outsourced page
    cy.url().should("eq", `https://localhost:9090${kycRoutes.individualInstantId}`);
  });
});
