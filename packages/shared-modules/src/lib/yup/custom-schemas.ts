import { ECountries } from "@neufund/shared-utils";
import includes from "lodash/includes";
import moment from "moment";
import * as Yup from "yup";

/**
 * Custom schema translations are baked in to this file, as this code is
 * outdated they will go soon.
 */
const VALIDATION_CURRENCY_CODE = "Must be a 3-letter currency code";
const VALIDATION_INVALID_DATE = "Please enter a valid date";
const VALIDATION_MIN_AGE = "You must be older than 18 years";
const VALIDATION_MAX_AGE = "You must be younger than 125 years";
const VALIDATION_DATE_IN_THE_FUTURE = "Founding date can not be in the future";
const VALIDATION_RESTRICTED_COUNTRY =
  "Unfortunately we do not accept investors or companies with residency in your country due to regulatory restrictions";
const VALIDATION_PERCENTAGE_MAX = "Value cannot exceed 100%";
const VALIDATION_PERCENTAGE_MIN = "Value cannot be less than 0%";

/**
 * Date schema
 */
export const DATE_SCHEME = "YYYY-M-D";
export const parseStringToMomentDate = (s: string) => moment(s, DATE_SCHEME, true);

export const currencyCodeSchema = (v: Yup.StringSchema) =>
  v.matches(/^[A-Z]{3}$/, {
    message: VALIDATION_CURRENCY_CODE,
  });

export const dateSchema = (v: Yup.StringSchema) =>
  v
    .transform((_value: unknown, originalValue: string): string | undefined => {
      if (originalValue === undefined) {
        return undefined;
      }
      const date = parseStringToMomentDate(originalValue);
      if (!date.isValid()) {
        return undefined;
      }
      return date.format(DATE_SCHEME);
    })
    .test("is-valid", VALIDATION_INVALID_DATE, s =>
      s !== undefined ? parseStringToMomentDate(s).isValid() : true,
    );

export const date = dateSchema(Yup.string());

export const personBirthDate = date
  .test("is-old-enough", VALIDATION_MIN_AGE, s => {
    if (s === undefined) {
      return true;
    } else {
      const d = parseStringToMomentDate(s);
      return d.isValid() && d.isBefore(moment().subtract(18, "years"));
    }
  })
  .test("is-young-enough", VALIDATION_MAX_AGE, s => {
    if (s === undefined) {
      return true;
    } else {
      const d = parseStringToMomentDate(s);
      return d.isValid() && d.isAfter(moment().subtract(125, "years"));
    }
  });

export const foundingDate = date.test("is-old-enough", VALIDATION_DATE_IN_THE_FUTURE, s => {
  const d = parseStringToMomentDate(s);
  return d.isValid() && d.isBefore(moment());
});

export const countryCode = Yup.string();

export const RESTRICTED_COUNTRIES = [
  ECountries.AFGHANISTAN,
  ECountries.BAHAMAS,
  ECountries.BOTSWANA,
  ECountries.CAMBODIA,
  ECountries.ETHIOPIA,
  ECountries.GHANA,
  ECountries.GUAM,
  ECountries.IRAN,
  ECountries.IRAQ,
  ECountries.LIBYAN_ARAB_JAMAHIRIYA,
  ECountries.NIGERIA,
  ECountries.NORTH_KOREA,
  ECountries.PAKISTAN,
  ECountries.PANAMA,
  ECountries.PUERTO_RICO,
  ECountries.SERBIA,
  ECountries.SRI_LANKA,
  ECountries.SYRIAN_ARAB_REPUBLIC,
  ECountries.TRINIDAD_AND_TOBAGO,
  ECountries.TUNISIA,
  ECountries.YEMEN,
];

export const restrictedCountry = countryCode.test(
  "country",
  VALIDATION_RESTRICTED_COUNTRY,
  response => !includes(RESTRICTED_COUNTRIES, response),
);

export const percentage = Yup.number()
  .max(100, VALIDATION_PERCENTAGE_MAX)
  .min(0, VALIDATION_PERCENTAGE_MIN);
