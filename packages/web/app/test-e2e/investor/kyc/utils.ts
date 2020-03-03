import { kycRoutes } from "../../../components/kyc/routes";
import { tid } from "../../utils";
import { fillForm } from "../../utils/forms";
import {
  kycBeneficialOwnerBusinessForm,
  kycBeneficialOwnerPersonalForm,
  kycCorporateCompanyForm,
  kycLegalRepForm,
  kycManagingDirectorForm,
} from "./fixtures";

export const goToPersonalVerification = () => {
  cy.visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();

  assertIndividualStart();
};

export const assertIndividualStart = () => {
  cy.get(tid("kyc.individual-start")).should("exist");

  cy.url().should("contain", kycRoutes.individualStart);
};

export const assertIndividualAddress = () => {
  cy.get(tid("kyc.individual-address")).should("exist");

  cy.url().should("contain", kycRoutes.individualAddress);
};

export const assertIndividualDocumentVerification = () => {
  cy.get(tid("kyc.individual-document-verification")).should("exist");

  cy.url().should("contain", kycRoutes.individualDocumentVerification);
};

export const goThroughKycCorporateProcess = () => {
  // company details page
  fillForm(kycCorporateCompanyForm);

  // managing director page
  cy.get(tid("kyc.managing-directors.add-new")).click();
  fillForm(kycManagingDirectorForm);
  cy.get(tid("kyc-managing-director-continue")).click();

  // beneficial owner page
  cy.get(tid("kyc.business.beneficial-owner.add-new-beneficial-owner")).click();
  fillForm(kycBeneficialOwnerPersonalForm);
  cy.get(tid("kyc.business.beneficial-owner.add-new-beneficial-owner")).click();
  fillForm(kycBeneficialOwnerBusinessForm);
  cy.get(tid("kyc-business-beneficial-owners-continue")).click();
  // account manager page
  cy.get(tid("kyc.business.legal-representative.add")).click();
  fillForm(kycLegalRepForm);
  cy.get(tid("kyc-business-legal-representative-continue")).click();
};

export const assertKYCSuccess = () => cy.get(tid("kyc-success")).should("exist");

export const goThroughKycCorporateProcessWithSkips = () => {
  // company details page
  fillForm(kycCorporateCompanyForm);

  // managing director page
  cy.get(tid("kyc.managing-directors.add-new")).click();
  fillForm(kycManagingDirectorForm);
  cy.get(tid("kyc-managing-director-continue")).click();

  // skip beneficial owner page
  cy.get(tid("kyc-business-beneficial-owners-continue")).click();

  // skip account manager page
  cy.get(tid("kyc-business-legal-representative-continue")).click();
};
