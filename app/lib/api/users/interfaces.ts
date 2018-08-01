import * as Yup from "yup";
import { WalletSubType, WalletType } from "../../../modules/web3/types";

export type TUserType = "investor" | "issuer";

export interface IUser {
  backupCodesVerified?: boolean;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: TUserType;
  walletType: WalletType;
  walletSubtype: WalletSubType;
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
  walletSubtype?: WalletSubType;
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
    walletType: Yup.string().oneOf(Object.keys(WalletType).map(type => type.toLowerCase())),
    walletSubtype: Yup.string().oneOf(Object.keys(WalletSubType).map(type => type.toLowerCase())),
  })
  .required();

export const emailStatus = Yup.object().shape({
  isAvailable: Yup.boolean(),
});
