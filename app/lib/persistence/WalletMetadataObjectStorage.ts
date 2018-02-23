import { WalletType } from "../../modules/web3/types";

export type TWalletMetadata = ILightWalletMetadata | IBrowserWalletMetadata | ILedgerWalletMetadata;

export interface ILightWalletMetadata {
  walletType: WalletType.LIGHT;
  vault: string;
  salt: string;
  email: string;
}

export interface IBrowserWalletMetadata {
  walletType: WalletType.BROWSER;
}

export interface ILedgerWalletMetadata {
  walletType: WalletType.LEDGER;
  derivationPath: string;
}

export const STORAGE_WALLET_METADATA_KEY = "NF_WALLET_METADATA";
