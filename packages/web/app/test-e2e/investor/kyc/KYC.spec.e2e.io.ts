import { kycRoutes } from "../../../components/kyc/routes";
import {
  confirmAccessModal,
  createAndLoginNewUser,
  fillForm,
  formField,
  tid,
} from "../../utils/index";
import { kycCorporateCompanyForm, kycManagingDirectorFormInvalid } from "./fixtures";
import {
  assertKYCSuccess,
  goThroughKycCorporateProcess,
  goThroughKycCorporateProcessWithSkips,
} from "./utils";

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
    confirmAccessModal();
    assertKYCSuccess();
  });

  it("should go through business KYC with skips @kyc @p3", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    goThroughKycCorporateProcessWithSkips();
    confirmAccessModal();
    assertKYCSuccess();
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

  it("kyc can't save managing director without PEP field @kyc", () => {
    createAndLoginNewUser({ type: "investor" });
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    // company details page
    fillForm(kycCorporateCompanyForm);

    // managing director page
    cy.get(tid("kyc.managing-directors.add-new")).click();
    fillForm(kycManagingDirectorFormInvalid, { submit: false });
    cy.get(tid("kyc.business.managing-director.save")).should("be.disabled");
  });
});
