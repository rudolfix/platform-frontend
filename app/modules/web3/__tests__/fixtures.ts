import { dummyEthereumAddress } from "../../../../test/fixtures";
import { ILightWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { WalletType } from "../types";

export const getDummyLightWalletMetadata = (): ILightWalletMetadata => ({
  walletType: WalletType.LIGHT,
  address: dummyEthereumAddress,
  vault: "vault",
  email: "test@example.com",
  salt: "salt",
});
