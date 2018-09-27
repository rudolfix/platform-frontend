import { dummyEthereumAddress } from "../../../../test/fixtures";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletSubType, WalletType } from "../types";

export const getDummyLightWalletMetadata = (): ILightWalletMetadata => ({
  walletType: WalletType.LIGHT,
  walletSubType: WalletSubType.UNKNOWN,
  address: dummyEthereumAddress,
  vault: "vault",
  email: "test@example.com",
  salt: "salt",
});

export const getDummyBrowserWalletMetadata = (): IBrowserWalletMetadata => ({
  walletType: WalletType.BROWSER,
  address: dummyEthereumAddress,
  walletSubType: WalletSubType.METAMASK,
});

export const getDummyLedgerWalletMetadata = (): ILedgerWalletMetadata => ({
  walletType: WalletType.LEDGER,
  walletSubType: WalletSubType.UNKNOWN,
  derivationPath: "derivationPath",
  address: dummyEthereumAddress,
});
