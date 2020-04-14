import { EthereumAddressWithChecksum } from "@neufund/shared";
import * as Yup from "yup";

// normalized information about all possible types of personal wallets
export enum EWalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
  LIGHT = "LIGHT",
  MOBILE = "MOBILE",
  UNKNOWN = "UNKNOWN",
}

export enum EWalletSubType {
  METAMASK = "METAMASK",
  PARITY = "PARITY",
  GNOSIS = "GNOSIS",
  NEUFUND = "NEUFUND",
  UNKNOWN = "UNKNOWN",
}

export enum EUserType {
  INVESTOR = "investor",
  ISSUER = "issuer",
  NOMINEE = "nominee",
}

export interface IUser {
  userId: EthereumAddressWithChecksum;
  backupCodesVerified?: boolean;
  latestAcceptedTosIpfs?: string;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}

export interface IEmailStatus {
  isAvailable: boolean;
}

export interface IUserInput {
  newEmail?: string;
  salt?: string;
  language?: string;
  backupCodesVerified?: boolean;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}

export interface IVerifyEmailUser {
  verificationCode: string;
}

export const UserSchema = Yup.object()
  .shape({
    userId: Yup.string().required(),
    backupCodesVerified: Yup.boolean(),
    latestAcceptedTosIpfs: Yup.string(),
    language: Yup.string(),
    unverifiedEmail: Yup.string(),
    verifiedEmail: Yup.string(),
    type: Yup.string().oneOf(["investor", "issuer", "nominee"]),
    walletType: Yup.string().oneOf(Object.keys(EWalletType).map(type => type.toLowerCase())),
    walletSubtype: Yup.string().oneOf(Object.keys(EWalletSubType).map(type => type.toLowerCase())),
  })
  .required();

export const emailStatusSchema = Yup.object().shape({
  isAvailable: Yup.boolean(),
});
