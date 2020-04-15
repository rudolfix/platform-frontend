import { EUSState } from "@neufund/shared-utils";

import { TFormFixture } from "../../utils/forms";

const kycPersonBaseForm: TFormFixture = {
  firstName: "John",
  lastName: "Doe",
  birthDate: {
    value: "20/01/1980",
    type: "date",
  },
  country: {
    value: "LI",
    type: "select",
  },
  placeOfBirth: {
    value: "AT",
    type: "select",
  },
  nationality: {
    value: "DE",
    type: "select",
  },
};

const kycPersonAddressForm: TFormFixture = {
  street: "Cuvrystr. 6",
  city: "Berlin",
  zipCode: "10247",
  "kyc-upload-documents-dropzone": {
    values: ["example.jpg", "example.png"],
    type: "multiple-files",
  },
};

const kycCorporateBaseForm: TFormFixture = {
  firstName: "John",
  lastName: "Doe",
  birthDate: {
    value: "20/01/1980",
    type: "date",
  },
  street: "Cuvrystr. 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "LI",
    type: "select",
  },
  placeOfBirth: {
    value: "AT",
    type: "select",
  },
  nationality: {
    value: "DE",
    type: "select",
  },
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
};

export const kycInvidualForm: TFormFixture = {
  ...kycPersonBaseForm,
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
  "kyc-personal-start-submit-form": {
    type: "submit",
  },
};

export const kycInvidualAddressForm: TFormFixture = {
  ...kycPersonAddressForm,
  "kyc-personal-address-submit-form": {
    type: "submit",
  },
};

export const kycInvidualAddressFormUSResident: TFormFixture = {
  ...kycInvidualAddressForm,
  usState: {
    value: EUSState.WEST_VIRGINIA,
    type: "select",
  },
};

export const kycInvidualFormUS: TFormFixture = {
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
  ...kycPersonBaseForm,
  nationality: {
    value: "US",
    type: "select",
  },
  isAccreditedUsCitizen: {
    value: "true",
    type: "select",
  },
};

export const kycInvidualFormUSResident: TFormFixture = {
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
  ...kycPersonBaseForm,
  country: {
    value: "US",
    type: "select",
  },
  isAccreditedUsCitizen: {
    value: "true",
    type: "select",
  },
};

export const kycFinancialDisclosureForm: TFormFixture = {
  isHighIncome: {
    value: "true",
    type: "select",
  },
  "kyc-personal-financial-disclosure-submit-form": {
    type: "submit",
  },
};

export const kycLegalRepForm: TFormFixture = {
  ...kycCorporateBaseForm,
  "kyc-upload-documents-dropzone": {
    values: ["example.jpg"],
    type: "multiple-files",
  },
  "kyc-company-legal-representative-save": {
    type: "submit",
  },
};

export const kycCorporateCompanyForm: TFormFixture = {
  name: "Neufund",
  registrationNumber: "123456789",
  legalForm: "UG",
  street: "Cuvrystraße 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "PL",
    type: "select",
  },
  jurisdiction: {
    value: "PL",
    type: "select",
  },
  "kyc-company-business-supporting-documents": {
    values: ["example.jpg"],
    type: "multiple-files",
  },
  "kyc-company-business-supporting-continue": {
    type: "submit",
  },
};

export const kycManagingDirectorForm: TFormFixture = {
  ...kycPersonBaseForm,
  ...kycPersonAddressForm,
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
  "kyc.business.managing-director.save": {
    type: "submit",
  },
};

export const kycManagingDirectorFormInvalid: TFormFixture = {
  ...kycPersonBaseForm,
  ...kycPersonAddressForm,
  "kyc.business.managing-director.save": {
    type: "submit",
  },
};

export const kycBeneficialOwnerPersonalForm: TFormFixture = {
  "person.firstName": "John",
  "person.lastName": "Doe",
  "person.birthDate": {
    value: "20/01/1980",
    type: "date",
  },
  "person.country": {
    value: "LI",
    type: "select",
  },
  "person.placeOfBirth": {
    value: "AT",
    type: "select",
  },
  "person.nationality": {
    value: "DE",
    type: "select",
  },
  "person.street": "Cuvrystr. 6",
  "person.city": "Berlin",
  "person.zipCode": "10247",
  "person.isPoliticallyExposed": {
    value: "false",
    type: "select",
  },
  "kyc-upload-documents-dropzone": {
    values: ["example.jpg", "example.png"],
    type: "multiple-files",
  },
  "kyc-business-beneficial-owner-save": {
    type: "submit",
  },
};

export const kycBeneficialOwnerBusinessForm: TFormFixture = {
  beneficialOwnerType: {
    type: "radio",
    value: "business",
  },
  "business.name": "Neufund",
  "business.legalForm": "UG",
  "business.street": "Cuvrystraße 6",
  "business.city": "Berlin",
  "business.zipCode": "10247",
  "business.country": {
    value: "PL",
    type: "select",
  },
  "business.jurisdiction": {
    value: "PL",
    type: "select",
  },
  "kyc-upload-documents-dropzone": {
    values: ["example.jpg"],
    type: "multiple-files",
  },
  "kyc-business-beneficial-owner-save": {
    type: "submit",
  },
};
