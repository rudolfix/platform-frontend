import { dummyEthereumAddressWithChecksum } from "../../../test/fixtures";
import {
  EWalletSubType,
  EWalletType,
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
} from "./types";

export const getDummyLightWalletMetadata = (): ILightWalletMetadata => ({
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
  address: dummyEthereumAddressWithChecksum,
  email: "test@example.com",
  salt: "salt",
});

export const getDummyBrowserWalletMetadata = (): IBrowserWalletMetadata => ({
  walletType: EWalletType.BROWSER,
  address: dummyEthereumAddressWithChecksum,
  walletSubType: EWalletSubType.METAMASK,
});

export const getDummyLedgerWalletMetadata = (): ILedgerWalletMetadata => ({
  walletType: EWalletType.LEDGER,
  walletSubType: EWalletSubType.UNKNOWN,
  derivationPath: "derivationPath",
  address: dummyEthereumAddressWithChecksum,
});
