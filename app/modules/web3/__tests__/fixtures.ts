import { dummyEthereumAddress } from "../../../../test/fixtures";
import {
  ICommonWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
} from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletType } from "../types";

const walletsCommon = {
  address: dummyEthereumAddress,
  vault: "vault",
  email: "test@example.com",
  salt: "salt",
};

interface IBrowserWalletMetadata extends ICommonWalletMetadata {
  walletType: WalletType.BROWSER;
  vault: string;
  salt: string;
  email: string;
}

export const getDummyLightWalletMetadata = (): ILightWalletMetadata => ({
  walletType: WalletType.LIGHT,
  ...walletsCommon,
});

export const getDummyBrowserWalletMetadata = (): IBrowserWalletMetadata => ({
  walletType: WalletType.BROWSER,
  ...walletsCommon,
});

export const getDummyLedgerWalletMetadata = (): ILedgerWalletMetadata => ({
  walletType: WalletType.LEDGER,
  derivationPath: "derivationPath",
  address: dummyEthereumAddress,
});
