import { tid } from "../utils";
import { kycRoutes } from "../../components/kyc/routes";
import { createAndLoginNewUser, DEFAULT_PASSWORD } from "../utils/userHelpers";

interface ISmallBusinessData {
  companyName: string;
  legalForm: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

const smallBusinessData: ISmallBusinessData = {
  companyName: "John",
  legalForm: "Doe",
  street: "example",
  city: "example",
  country: "DE",
  zipCode: "00000",
};

interface IPersonData {
  firstName: string;
  lastName: string;
  birthday: {
    day: string;
    month: string;
    year: string;
  };
  street: string;
  city: string;
  country: string;
  placeOfBirth: string;
  nationality: string;
  zipCode: string;
  isPoliticallyExposed: string;
  isUsCitizen: string;
  hasHighIncome: string;
}

const personData: IPersonData = {
  firstName: "John",
  lastName: "Doe",
  birthday: {
    day: "01",
    month: "01",
    year: "1990",
  },
  street: "example",
  city: "example",
  country: "DE",
  placeOfBirth: "UA",
  nationality: "PL",
  zipCode: "00000",
  isPoliticallyExposed: "true",
  isUsCitizen: "false",
  hasHighIncome: "false",
};

const goToCorporationFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-company")).click();
  cy.get(tid("kyc-start-business-go-to-corporation")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);
};

const submitSmallBusinessKYCForm = (smallBusiness: ISmallBusinessData) => {
  cy.get(tid("kyc-company-business-data-company-name")).type(smallBusiness.companyName);
  cy.get(tid("kyc-company-business-data-legal-form")).type(smallBusiness.legalForm);
  cy.get(tid("kyc-company-business-data-street")).type(smallBusiness.street);
  cy.get(tid("kyc-company-business-data-city")).type(smallBusiness.city);
  cy.get(tid("kyc-company-business-data-zip-code")).type(smallBusiness.zipCode);
  cy.get(tid("kyc-company-business-data-country")).select(smallBusiness.country);
  cy.get(tid("kyc-company-business-data-save")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.businessData}`);
};

const uploadSupportingDocumentsAndSubmitForm = () => {
  const dropEvent = {
    dataTransfer: {
      files: [] as any,
    },
  };

  cy.fixture("example.png").then(picture => {
    return Cypress.Blob.base64StringToBlob(picture, "image/png").then((blob: any) => {
      dropEvent.dataTransfer.files.push(blob);
    });
  });

  cy.get(tid("kyc-company-business-supporting-documents")).trigger("drop", dropEvent);
  cy.get(tid("kyc-company-business-supporting-continue")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
};

const submitLegalRepresentationForm = (person: IPersonData) => {
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

const uploadSupportingDocuments = () => {
  const dropEvent = {
    dataTransfer: {
      files: [] as any,
    },
  };

  cy.fixture("example.png").then(picture => {
    return Cypress.Blob.base64StringToBlob(picture, "image/png").then((blob: any) => {
      dropEvent.dataTransfer.files.push(blob);
    });
  });

  cy.get(tid("kyc-company-legal-representative-documents")).trigger("drop", dropEvent);
};

const addAndDeleteBeneficialOwnerAndSubmitFormForLegalRepresentation = () => {
  cy.get(tid("kyc-beneficial-owner-add-new"))
    .wait(1500)
    .click();
  cy.get(tid("kyc-beneficial-owner-delete")).click();
  cy.get(tid("kyc-company-legal-representative-upload-and-submit")).click();
  cy.get(tid("access-light-wallet-password-input")).type(DEFAULT_PASSWORD);
  cy.get(tid("access-light-wallet-confirm")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
};

describe("KYC Small Business flow with manual verification", () => {
  beforeEach(() => createAndLoginNewUser({ type: "investor" }));

  it("went through KYC Small Business flow", () => {
    goToCorporationFlow();
    submitSmallBusinessKYCForm(smallBusinessData);
    uploadSupportingDocumentsAndSubmitForm();
    submitLegalRepresentationForm(personData);
    uploadSupportingDocuments();
    addAndDeleteBeneficialOwnerAndSubmitFormForLegalRepresentation();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
  });
});
