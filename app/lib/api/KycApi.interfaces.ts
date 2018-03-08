import * as Yup from "yup";

export interface IKycPerson {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthdate?: string;
}

export const KycPersonSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  lastName: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  address: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  city: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  zipCode: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  country: Yup.string()
    .required("This field is required")
    .min(3, "Must be longer than 3"),
  birthdate: Yup.string()
    .required("Your birthdate is required")
    .min(3, "Must be longer than 3"),
});

// individual data
export interface IKycIndividualData extends IKycPerson {
  isUsCitizen?: boolean;
  isPoliticallyExposed?: boolean;
  highIncome?: boolean;
}

export const KycIndividudalDataSchema = KycPersonSchema.concat(
  Yup.object().shape({
    isUsCitizen: Yup.bool(),
    isPoliticallyExposed: Yup.bool(),
    highIncome: Yup.bool(),
  }),
);

// business data
export interface IKycBusinessData {
  name?: string;
  legalForm?: string;
  legalFormType?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthdate?: string;
  email?: string;
  jurisdictionOfIncorporation?: string;
}

export const KycBusinessDataSchema = Yup.object().shape({
  name: Yup.string()
    .required("Your first name is required")
    .min(3, "Must be longer than 3"),
  legalForm: Yup.string()
    .required("Your last name is required")
    .min(3, "Must be longer than 3"),
  legalFormType: Yup.string()
    .required("Your last name is required")
    .min(3, "Must be longer than 3"),
  address: Yup.string()
    .required("Your address is required")
    .min(3, "Must be longer than 3"),
  city: Yup.string()
    .required("Your city is required")
    .min(3, "Must be longer than 3"),
  zipCode: Yup.string()
    .required("Your zip code is required")
    .min(3, "Must be longer than 3"),
  country: Yup.string()
    .required("Your country is required")
    .min(3, "Must be longer than 3"),
  jurisdictionOfIncorporation: Yup.string()
    .required("Your birthdate is required")
    .min(3, "Must be longer than 3"),
});

// legal representative (same as base person)
export interface IKycLegalRepresentative extends IKycPerson {}
export const KycLegalRepresentativeSchema = KycPersonSchema;

// beneficial owner
export interface IKycBeneficialOwner extends IKycPerson {
  ownership?: number;
  id?: string;
}
export const KycBeneficialOwnerSchema = KycPersonSchema.concat(
  Yup.object().shape({
    ownership: Yup.number().required("Your percent ownership is required"),
    id: Yup.string(),
  }),
);

// file
export interface IKycFileInfo {
  id: string;
  name: string;
  size: number;
}

export const KycFileInfoShape = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  size: Yup.number().required(),
});

// request state
export type TRequestStatus = "draft" | "pending" | "outsourced" | "rejected" | "approved";
export interface IKycRequestState {
  status: TRequestStatus;
}

export const KycRequestStateSchema = Yup.object().shape({
  status: Yup.string().required("Request state is required"),
  outsourcedUrl: Yup.string(),
  type: Yup.string(),
});

export type TKycBusinessType = "corporate" | "small" | "partnership";
