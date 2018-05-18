import { tid } from "../../../../test/testUtils";
import { appRoutes } from "../../appRoutes";
import { registerWithLightWallet } from "../../walletSelector/light/__tests__/LightWalletRegister.spec.e2e";
import { kycRoutes } from "../routes";

interface IPersonData {
  firstName: string;
  lastName: string;
  birthday: {
    day: string,
    month: string,
    year: string
  };
  street: string;
  city: string;
  country: string;
  zipCode: string;
  isPoliticallyExposed: string;
  isUsCitizen: string;
  hasHighIncome: string;
}

const personData = {
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
  cy.visit("/register");

  cy.get(tid("wallet-selector-register-email")).type("testemail@email.email");
  cy.get(tid("wallet-selector-register-password")).type("such-strong-password");
  cy.get(tid("wallet-selector-register-confirm-password")).type("such-strong-password");
  cy.get(tid("wallet-selector-register-button")).click();

  cy.wait(3000).visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();

  cy.wait(2000).url().should("eq", `https://localhost:9090${kycRoutes.individualStart}`);
}

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

  cy.wait(1000).url().should("eq", `https://localhost:9090${kycRoutes.individualInstantId}`);
}

const goToIndividualManualVerification = () => {
  cy.get(tid("kyc-go-to-manual-verification")).click();

  cy.wait(1000).url().should("eq", `https://localhost:9090${kycRoutes.individualUpload}`);
}

const uploadDocumentAndSubmitForm = () => {
  cy.fixture("../../../assets/img/wallet_selector/logo_mist.png").as('logo')
  cy.get("input[type=file]").then(($input: any) => {

    // convert the logo base64 string to a blob
    // tslint:disable-next-line:no-invalid-this
    return Cypress.Blob.base64StringToBlob(this.logo, "image/png").then((blob: any) => {

      // pass the blob to the fileupload jQuery plugin
      // used in your application's code
      // which initiates a programmatic upload
      $input.fileupload("add", { files: blob })
    });

    cy.wait(1000).url().should("eq", `https://localhost:9090${kycRoutes.pending}`);
  });

  cy.get(tid("kyc-personal-upload-submit")).click();
}

describe("KYC Personal flow with manual verification", () => {
  it("should go to INDIVIDUAL flow from KYC start page", goToIndividualKYCFlow);

  it("should submit form and go to INSTANT ID page", () => {
    submitIndividualKYCForm(personData);
  });

  it("should go to MANUAL VERIFICATION page", goToIndividualManualVerification);

  it("should upload document and go to another CONFIRMATION page", uploadDocumentAndSubmitForm);
});
