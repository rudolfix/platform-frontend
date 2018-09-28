import { TWalletMetadata } from "../../persistence/WalletMetadataObjectStorage";
import { TUserType } from "./interfaces";

export const getDummyUser = (walletMetadata: TWalletMetadata) => ({
  userId: "user-id",
  type: "investor" as TUserType,
  walletType: walletMetadata.walletType,
  walletSubtype: walletMetadata.walletSubType,
});
