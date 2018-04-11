import * as Yup from "yup";

export interface IUser {
  backupCodesVerified?: boolean;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
}

export interface IUserInput {
  newEmail?: string;
  salt?: string;
  language?: string;
  backupCodesVerified?: boolean;
}

export interface IVerifyEmailUser {
  verificationCode: string;
}

export const UserValidator = Yup.object()
  .shape({
    backupCodesVerified: Yup.boolean(),
    language: Yup.string(),
    unverifiedEmail: Yup.string(),
    verifiedEmail: Yup.string(),
  })
  .required();
