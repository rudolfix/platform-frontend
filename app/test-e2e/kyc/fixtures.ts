export const personData = {
  firstName: "John",
  lastName: "Doe",
  birthday: {
    day: "01",
    month: "01",
    year: "1990",
  },
  street: "Cuvrystr. 9",
  city: "Berlin",
  country: "DE",
  placeOfBirth: "UA",
  nationality: "PL",
  zipCode: "10247",
  isPoliticallyExposed: "true",
  isUsCitizen: "false",
  hasHighIncome: "false",
};

export type IPersonData = typeof personData;

export const businessData = {
  companyName: "John",
  legalForm: "Doe",
  street: "example",
  city: "example",
  country: "DE",
  zipCode: "00000",
};

export type IBusinessData = typeof businessData;
