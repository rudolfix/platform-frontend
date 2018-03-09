import * as Yup from "yup";

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
  birthDate: Yup.string(),
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

// business data
export interface IKycBusinessData {
  name?: string;
  legalForm?: string;
  legalFormType?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  email?: string;
  jurisdiction?: string;
}

export const KycBusinessDataSchema = Yup.object().shape({
  name: Yup.string(),
  legalForm: Yup.string(),
  legalFormType: Yup.string(),
  address: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: Yup.string(),
  jurisdiction: Yup.string(),
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
    ownership: Yup.number(),
    id: Yup.string(),
  }),
);

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
