import * as Yup from "yup";
import { isUsCitizen, makeAllRequired, personBirthDate } from "./util/schemaHelpers";

export type TKycRequestType = "business" | "individual";

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
  birthDate: personBirthDate,
  isPoliticallyExposed: Yup.bool(),
  isUsCitizen: isUsCitizen,
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
export type TRequestStatus = "Draft" | "Pending" | "Outsourced" | "Rejected" | "Accepted";
export interface IKycRequestState {
  status: TRequestStatus;
  redirectUrl?: string;
}

export const KycRequestStateSchema = Yup.object().shape({
  status: Yup.string().required("Request state is required"),
  redirectUrl: Yup.string(),
  type: Yup.string(),
});

export type TKycBusinessType = "corporate" | "small" | "partnership";
