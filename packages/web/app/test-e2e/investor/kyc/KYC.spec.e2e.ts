import { kycRoutes } from "../../../components/kyc/routes";
import { createAndLoginNewUser, fillForm, formField, tid } from "../../utils/index";
import { kycCorporateCompanyForm } from "./fixtures";
import { goThroughKycCorporateProcess } from "./utils";

describe("KYC", () => {
  it("should block kyc flow for Permanent Residence CAMBODIA (KH) region @kyc @p2", () => {
    const BLOCKED_COUNTRY = "Cambodia";

    createAndLoginNewUser({ type: "investor" });
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-personal")).awaitedClick();

    cy.get(tid("kyc-personal-start-country")).select(BLOCKED_COUNTRY);

    cy.get(tid("form.country.error-message")).should("exist");
  });

  it("should go through business KYC @kyc @p2", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    goThroughKycCorporateProcess();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending")).should("exist");
  });

  it("should not let user upload unsupported file formats @kyc @files @p3", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    fillForm(kycCorporateCompanyForm);

    const validFile = "example.jpg";
    const invalidFile = "INV_EUR_ICBM_HAS_KYC_ADDRESS.svg";
    cy.get(formField("kyc-company-business-supporting-documents")).within(() => {
      cy.get(tid("multi-file-upload-dropzone")).dropFiles([validFile, invalidFile]);
      cy.get(tid(`multi-file-upload-file-${validFile}`)).should("exist");
      cy.get(tid(`multi-file-upload-file-${invalidFile}`)).should("not.exist");
    });
  });
});
