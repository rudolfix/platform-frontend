import { kycRoutes } from "../../components/kyc/routes";
import { fillForm } from "../utils/forms";
import { formField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycCorporateCompanyForm } from "./fixtures";
import { goThroughKycCorporateProcess } from "./utils";

describe("KYC Business flow", () => {
  it("with manual verification should went through KYC business flow", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    goThroughKycCorporateProcess();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending")).should("exist");
  });

  it("support document upload ignores unsupported file format", () => {
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
