import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import { TUserType } from "./interfaces";

export const getDummyUser = (walletMetadata: TWalletMetadata) => ({
  type: "investor" as TUserType,
  walletType: walletMetadata.walletType,
  walletSubtype: walletMetadata.walletSubType,
});
