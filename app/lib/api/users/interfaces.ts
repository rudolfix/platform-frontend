import * as Yup from "yup";
import { WalletType, WalletSubType } from "../../../modules/web3/types";

export type TUserType = "investor" | "issuer";

export interface IUser {
  backupCodesVerified?: boolean;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: TUserType;
}

export interface IEmailStatus {
  isAvailable: boolean;
}

export interface IUserInput {
  newEmail?: string;
  salt?: string;
  language?: string;
  backupCodesVerified?: boolean;
  type: TUserType;
  walletType: WalletType;
  WalletSubtype?: WalletSubType;
  // TODO:MAKE WalletSubtype required
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
    type: Yup.string().oneOf(["investor", "issuer"]),
  })
  .required();

export const emailStatus = Yup.object().shape({
  isAvailable: Yup.boolean(),
});
