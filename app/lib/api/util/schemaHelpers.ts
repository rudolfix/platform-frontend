import { includes, mapValues } from "lodash";
import * as moment from "moment";
import * as Yup from "yup";

/**
 * Schema helpers
 * semi documented.... :)
 */
export const makeAllRequired = (schema: Yup.ObjectSchema<any>): Yup.ObjectSchema<any> => {
  const oldFields: { [key: string]: Yup.MixedSchema } = (schema as any).fields;
  const newFields = mapValues(oldFields, schema => schema.required());
  return Yup.object().shape(newFields);
};

/**
 * Date schema
 */
const DATE_SCHEME = "YYYY-M-D";
const parse = (s: string) => moment(s, DATE_SCHEME, true);
export const date = Yup.string()
  .transform(function(_value: any, originalValue: string): string {
    const date = parse(originalValue);
    if (!date.isValid()) {
      return "";
    }
    return date.format(DATE_SCHEME);
  })
  .test("is-valid", "Please enter a valid date", s => {
    return parse(s).isValid();
  });
//TODO: Add translations
export const personBirthDate = date
  .test("is-old-enough", "You must be older than 18 years", s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment().subtract(18, "years"));
  })
  .test("is-young-enough", "You must be younger than 100 years", s => {
    const d = parse(s);
    return d.isValid() && d.isAfter(moment().subtract(100, "years"));
  });

export const foundingDate = date.test(
  "is-old-enough",
  "Founding date can not be in the future",
  s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment());
  },
);

export const citizen = Yup.bool();

//TODO: add to translations
export const isUsCitizen = citizen.test(
  "is-us-citizen",
  "We are very sorry, at the moment we cannot serve US customers due to regulatory uncertainties.",
  response => {
    return response === false;
  },
);

export const countryCode = Yup.string();
export const RESTRICTED_COUNTRIES = [
  "KP",
  "ET",
  "IR",
  "PK",
  "RS",
  "LK",
  "SY",
  "TT",
  "TN",
  "YE",
  "US",
];

export const restrictedCountry = countryCode.test(
  "country",
  "Unfortunately, we do not accept investors or companies coming from your country due to regulatory restrictions.",
  response => {
    return !includes(RESTRICTED_COUNTRIES, response);
  },
);
