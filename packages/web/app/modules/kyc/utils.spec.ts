import { ECountries } from "@neufund/shared-utils";
import { expect } from "chai";

import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EBeneficialOwnerType } from "./types";
import {
  conditionalCounter,
  getBeneficialOwnerCountry,
  getBeneficialOwnerId,
  validateBeneficiaryOwner,
} from "./utils";

describe("KYC utils tests", () => {
  const validBusinessOwner = {
    business: {
      name: "Neufund",
      registrationNumber: "123456789",
      legalForm: "UG",
      street: "Cuvrystraße 6",
      city: "Berlin",
      zipCode: "10247",
      country: ECountries.GERMANY,
      jurisdiction: EJurisdiction.GERMANY,
      id: "5",
    },
  };
  const validPersonOwner = {
    person: {
      firstName: "Arjun",
      lastName: "Umesha",
      street: "Curvystrasse",
      city: "Berlin",
      zipCode: "12437",
      country: ECountries.AUSTRIA,
      birthDate: "1992-01-01",
      placeOfBirth: "DE",
      nationality: "AL",
      isPoliticallyExposed: false,
      id: "8491ae5b-5777-43d9-aa76-2f26eef78c97",
    },
  };

  const invalidBusinessOwner = {
    business: {
      name: "",
      registrationNumber: "",
      legalForm: "",
      street: "",
      city: "",
      zipCode: "",
      country: "",
      jurisdiction: "",
      id: "5",
    },
  };
  const invalidPersonOwner = {
    person: {
      firstName: "",
      lastName: " ",
      street: "",
      city: "",
      zipCode: "",
      country: "",
      birthDate: "",
      placeOfBirth: "",
      nationality: "",
      isPoliticallyExposed: false,
      id: "5",
    },
  };

  it("Counter increments or decrements based on condition", () => {
    expect(conditionalCounter(true, 0)).to.eq(1);
    expect(conditionalCounter(true, 1)).to.eq(2);
    expect(conditionalCounter(false, 2)).to.eq(1);
    expect(conditionalCounter(false, 1)).to.eq(0);
  });

  it("getBeneficialOwnerId returns id", () => {
    expect(getBeneficialOwnerId({ business: { id: "5" } })).to.eq("5");
    expect(getBeneficialOwnerId({ person: { id: "6" } })).to.eq("6");
  });

  it("getBeneficialOwnerCountry returns country", () => {
    expect(getBeneficialOwnerCountry(validBusinessOwner)).to.eq(ECountries.GERMANY);
    expect(getBeneficialOwnerCountry(validPersonOwner)).to.eq(ECountries.AUSTRIA);
  });

  it("validateBeneficiaryOwner checks if is owner valid", () => {
    expect(validateBeneficiaryOwner(EBeneficialOwnerType.BUSINESS, invalidBusinessOwner)).to.eq(
      false,
    );
    expect(validateBeneficiaryOwner(EBeneficialOwnerType.PERSON, invalidPersonOwner)).to.eq(false);

    expect(validateBeneficiaryOwner(EBeneficialOwnerType.BUSINESS, validBusinessOwner)).to.eq(true);
    expect(validateBeneficiaryOwner(EBeneficialOwnerType.PERSON, validPersonOwner)).to.eq(true);
  });
});
