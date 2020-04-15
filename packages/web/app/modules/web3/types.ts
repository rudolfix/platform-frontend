import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { ESignerType } from "@neufund/shared-modules";

import { ESignTransactionMethod } from "../../lib/web3/types";

// normalized information about all possible types of personal wallets
export enum EWalletType {
  LEDGER = "LEDGER",
  WALLETCONNECT = "WALLETCONNECT",
  BROWSER = "BROWSER",
  LIGHT = "LIGHT",
  UNKNOWN = "UNKNOWN",
}
export enum EWalletSubType {
  METAMASK = "METAMASK",
  PARITY = "PARITY",
  GNOSIS = "GNOSIS",
  NEUFUND = "NEUFUND",
  UNKNOWN = "UNKNOWN",
}

export type TWcWalletSubtypes =
  | EWalletSubType.UNKNOWN
  | EWalletSubType.METAMASK
  | EWalletSubType.NEUFUND;

export type TWalletMetadata =
  | ILightWalletMetadata
  | IBrowserWalletMetadata
  | ILedgerWalletMetadata
  | IWalletConnectMetadata;

export interface ICommonWalletMetadata {
  address: EthereumAddressWithChecksum;
}

export interface ILightWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.LIGHT;
  walletSubType: EWalletSubType.UNKNOWN;
  salt: string;
  email: string;
}

/**
 * Data that are needed to recreate light wallet instance. Note that its missing ethereum address since it will be derived from vault.
 */
export interface ILightWalletRetrieveMetadata {
  walletType: EWalletType.LIGHT;
  vault: string;
  salt: string;
  email: string;
}

export interface IBrowserWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.BROWSER;
  walletSubType: EWalletSubType;
}

export interface ILedgerWalletMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.LEDGER;
  walletSubType: EWalletSubType.UNKNOWN;
  derivationPath: string;
}

export interface IWalletConnectMetadata extends ICommonWalletMetadata {
  walletType: EWalletType.WALLETCONNECT;
  walletSubType: EWalletSubType.UNKNOWN | EWalletSubType.METAMASK | EWalletSubType.NEUFUND;
  sendTransactionMethod: ESignTransactionMethod;
  signerType: ESignerType;
  sessionRequestTimeout: number;
  signingTimeout: number;
  supportsExplicitTimeouts: boolean;
  supportSessionPings: boolean;
  supportsRemoteKyc: boolean;
  supportsWalletMigration: boolean;
}
