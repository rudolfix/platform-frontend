import { tid } from "../../../../test/testUtils";
import { registerWithLightWallet } from "../../walletSelector/light/__tests__/LightWalletRegister.spec.e2e";
import { kycRoutes } from "../routes";

const email = "test+individual@neufund.org";
const password = "superstrongpassword";

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

const goToIndividualKYCFlow = () => {
  cy.visit(kycRoutes.start);
  cy.get(tid("kyc-start-go-to-personal")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);
};

const submitIndividualKYCForm = (person: IPersonData) => {
  cy.get(tid("kyc-personal-start-first-name")).type(person.firstName);
  cy.get(tid("kyc-personal-start-last-name")).type(person.lastName);

  cy.get(tid("form-field-date-day")).type(person.birthday.day);
  cy.get(tid("form-field-date-month")).type(person.birthday.month);
  cy.get(tid("form-field-date-year")).type(person.birthday.year);

  cy.get(tid("kyc-personal-start-street")).type(person.street);
  cy.get(tid("kyc-personal-start-city")).type(person.city);
  cy.get(tid("kyc-personal-start-zip-code")).type(person.zipCode);
  cy.get(tid("kyc-personal-start-country")).select(person.country);

  cy.get(tid("kyc-personal-start-is-politically-exposed")).select(person.isPoliticallyExposed);
  cy.get(tid("kyc-personal-start-is-us-citizen")).select(person.isUsCitizen);
  cy.get(tid("kyc-personal-start-has-high-income")).select(person.hasHighIncome);

  cy.get(tid("kyc-personal-start-submit-form")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualInstantId}`);
};

const goToIndividualManualVerification = () => {
  cy.get(tid("kyc-go-to-manual-verification")).click();

  cy.url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);
};

const uploadDocumentAndSubmitForm = () => {
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

  cy.get(tid("kyc-personal-upload-dropzone")).trigger("drop", dropEvent);

  cy.get(tid("kyc-personal-upload-submit")).click();
  cy.get(tid("access-light-wallet-password-input")).type(password);
  cy.get(tid("access-light-wallet-confirm")).click();
};

describe("KYC Personal flow with manual verification", () => {
  it("went through KYC flow with personal data", () => {
    registerWithLightWallet(email, password);
    goToIndividualKYCFlow();
    submitIndividualKYCForm(personData);
    goToIndividualManualVerification();
    uploadDocumentAndSubmitForm();

    cy.url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);
  });
});
