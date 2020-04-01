import { EthereumAddressWithChecksum } from "@neufund/shared";

import { SignerType } from "../../lib/web3/PersonalWeb3";

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
  UNKNOWN = "UNKNOWN",
}

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
  walletSubType: EWalletSubType.UNKNOWN;
  sendTransactionMethod: string, //todo move to enum
  signerType: SignerType;
  sessionRequestTimeout: number;
  signTimeout: number;
}
