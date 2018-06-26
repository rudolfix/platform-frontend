import { tid } from "../../../../test/testUtils";
import { kycRoutes } from "../routes";
import { registerWithLightWallet } from "../../../e2e-test-utils";

const email = "test+partnership@neufund.org";
const password = "superstrongpassword";

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
  zipCode: "00000",
  isPoliticallyExposed: "true",
  isUsCitizen: "false",
  hasHighIncome: "false",
};

const goToCorporationFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-company")).click();
  cy.get(tid("kyc-start-business-go-to-partnership")).click();

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

const submitLegalRepresentativeForm = () => {
  cy.get(tid("kyc-company-legal-representative-upload-and-submit")).click();
  cy.get(tid("access-light-wallet-password-input")).type(password);
  cy.get(tid("access-light-wallet-confirm")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
};

describe("KYC Small Business flow with manual verification", () => {
  it("went through KYC Small Business flow", () => {
    registerWithLightWallet(email, password);
    goToCorporationFlow();
    submitSmallBusinessKYCForm(smallBusinessData);
    uploadSupportingDocumentsAndSubmitForm();
    submitLegalRepresentationForm(personData);
    uploadSupportingDocuments();
    submitLegalRepresentativeForm();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.legalRepresentative}`);
  });
});
