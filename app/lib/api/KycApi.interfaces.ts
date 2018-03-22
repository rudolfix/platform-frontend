import { mapValues } from "lodash";
import * as moment from "moment";
import * as Yup from "yup";

/**
 * Schema helpers
 * semi documented.... :)
 */
const makeAllRequired = (schema: Yup.ObjectSchema): Yup.ObjectSchema => {
  const oldFields: { [key: string]: Yup.MixedSchema } = (schema as any).fields;
  const newFields = mapValues(oldFields, schema => schema.required("This field is required"));
  return Yup.object().shape(newFields);
};

// custom person date
const DATE_SCHEME = "YYYY-M-D";
const parse = (s: string) => moment(s, DATE_SCHEME, true);
const customDate = Yup.string()
  .transform(function(_value: any, originalValue: string): string {
    const date = parse(originalValue);
    if (!date.isValid()) {
      return "";
    }
    return date.format(DATE_SCHEME);
  })
  .test("is-valid", "Please enter a valid date", s => {
    return parse(s).isValid();
  })
  .test("is-old-enough", "This person must be older than 18 years.", s => {
    const d = parse(s);
    return d.isValid() && d.isBefore(moment().subtract(18, "years"));
  })
  .test("is-young-enough", "This person must be younger than 100 years.", s => {
    const d = parse(s);
    return d.isValid() && d.isAfter(moment().subtract(100, "years"));
  });

export interface IKycPerson {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthDate?: string;
  isPoliticallyExposed?: boolean;
}

export const KycPersonSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: Yup.string(),
  birthDate: customDate,
  isPoliticallyExposed: Yup.bool(),
});

// individual data
export interface IKycIndividualData extends IKycPerson {
  isUsCitizen?: boolean;
  isHighIncome?: boolean;
}

export const KycIndividudalDataSchema = KycPersonSchema.concat(
  Yup.object().shape({
    isUsCitizen: Yup.bool(),
    isHighIncome: Yup.bool(),
  }),
);

export const KycIndividudalDataSchemaRequired = makeAllRequired(KycIndividudalDataSchema);

// business data
export interface IKycBusinessData {
  name?: string;
  legalForm?: string;
  legalFormType?: TKycBusinessType;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  jurisdiction?: string;
}

export const KycBusinessDataSchema = Yup.object().shape({
  name: Yup.string(),
  legalForm: Yup.string(),
  legalFormType: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: Yup.string(),
  jurisdiction: Yup.string().default("de"),
});
export const KycBusinessDataSchemaRequired = makeAllRequired(KycBusinessDataSchema);

// legal representative (same as base person)
export interface IKycLegalRepresentative extends IKycPerson {}
export const KycLegalRepresentativeSchema = KycPersonSchema;
export const KycLegalRepresentativeSchemaRequired = makeAllRequired(KycPersonSchema);

// beneficial owner
export interface IKycBeneficialOwner extends IKycPerson {
  ownership?: number;
  id?: string;
}
export const KycBeneficialOwnerSchema = KycPersonSchema.concat(
  Yup.object().shape({
    ownership: Yup.number(),
    id: Yup.string(),
  }),
);
export const KycBeneficialOwnerSchemaRequired = makeAllRequired(KycBeneficialOwnerSchema);

// file
export interface IKycFileInfo {
  id: string;
  fileName: string;
}

export const KycFileInfoShape = Yup.object().shape({
  id: Yup.string(),
  fileName: Yup.string(),
});

// request state
export type TRequestStatus = "Draft" | "Pending" | "OutSourced" | "Rejected" | "Approved";
export interface IKycRequestState {
  status: TRequestStatus;
}

export const KycRequestStateSchema = Yup.object().shape({
  status: Yup.string().required("Request state is required"),
  outsourcedUrl: Yup.string(),
  type: Yup.string(),
});

export type TKycBusinessType = "corporate" | "small" | "partnership";
