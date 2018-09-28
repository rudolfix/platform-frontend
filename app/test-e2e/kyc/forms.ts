import { kycRoutes } from "../../components/kyc/routes";
import { tid } from "../utils";
import { uploadFileToFieldWithTid } from "../utils/forms";
import { DEFAULT_PASSWORD } from "../utils/userHelpers";
import { IBusinessData, IPersonData } from "./fixtures";

export const submitBusinessKYCForm = (business: IBusinessData) => {
  cy.get(tid("kyc-company-business-data-company-name")).type(business.companyName);
  cy.get(tid("kyc-company-business-data-legal-form")).type(business.legalForm);
  cy.get(tid("kyc-company-business-data-street")).type(business.street);
  cy.get(tid("kyc-company-business-data-city")).type(business.city);
  cy.get(tid("kyc-company-business-data-zip-code")).type(business.zipCode);
  cy.get(tid("kyc-company-business-data-country")).select(business.country);
  cy.get(tid("kyc-company-business-data-save")).click();
  cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);
};

export const submitLegalRepresentationForm = (person: IPersonData) => {
  cy.get(tid("kyc-company-legal-representative-first-name")).type(person.firstName);
  cy.get(tid("kyc-company-legal-representative-last-name")).type(person.lastName);
  cy.get(tid("form-field-date-day")).type(person.birthday.day);
  cy.get(tid("form-field-date-month")).type(person.birthday.month);
  cy.get(tid("form-field-date-year")).type(person.birthday.year);
  cy.get(tid("kyc-company-legal-representative-address")).type(person.street);
  cy.get(tid("kyc-company-legal-representative-city")).type(person.city);
  cy.get(tid("kyc-company-legal-representative-zip-code")).type(person.zipCode);
  cy.get(tid("kyc-company-legal-representative-country")).select(person.country);
  cy.get(tid("kyc-company-legal-representative-place-of-birth")).select(person.placeOfBirth);
  cy.get(tid("kyc-company-legal-representative-nationality")).select(person.nationality);
  cy.get(tid("kyc-company-legal-representative-pep")).select(person.isPoliticallyExposed);

  cy.get(tid("kyc-company-legal-representative-save")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
};

export const submitIndividualKYCForm = (person: IPersonData) => {
  cy.get(tid("kyc-personal-start-first-name")).type(person.firstName);
  cy.get(tid("kyc-personal-start-last-name")).type(person.lastName);

  cy.get(tid("form-field-date-day")).type(person.birthday.day);
  cy.get(tid("form-field-date-month")).type(person.birthday.month);
  cy.get(tid("form-field-date-year")).type(person.birthday.year);

  cy.get(tid("kyc-personal-start-street")).type(person.street);
  cy.get(tid("kyc-personal-start-city")).type(person.city);
  cy.get(tid("kyc-personal-start-zip-code")).type(person.zipCode);
  cy.get(tid("kyc-personal-start-country")).select(person.country);
  cy.get(tid("kyc-personal-start-place-of-birth")).select(person.placeOfBirth);
  cy.get(tid("kyc-personal-start-nationality")).select(person.nationality);

  cy.get(tid("kyc-personal-start-is-politically-exposed")).select(person.isPoliticallyExposed);
  cy.get(tid("kyc-personal-start-is-us-citizen")).select(person.isUsCitizen);
  cy.get(tid("kyc-personal-start-has-high-income")).select(person.hasHighIncome);

  cy.get(tid("kyc-personal-start-submit-form")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualInstantId}`);
};

export const uploadBusinessSupportingDocumentsAndSubmitForm = () => {
  uploadFileToFieldWithTid("kyc-company-business-supporting-documents");
  cy.get(tid("kyc-company-business-supporting-continue")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
};

export const uploadLegalRepSupportingDocuments = () => {
  uploadFileToFieldWithTid("kyc-company-legal-representative-documents");
};

export const acceptWallet = () => {
  cy.get(tid("access-light-wallet-password-input")).type(DEFAULT_PASSWORD);
  // for some reason we have to wait for 2 seconds before this button works...
  cy.wait(2000);
  cy.get(tid("access-light-wallet-confirm")).click();
};
