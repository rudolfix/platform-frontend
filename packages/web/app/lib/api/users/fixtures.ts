import { TWalletMetadata } from "../../../modules/web3/types";
import { EthereumAddressWithChecksum } from "../../../types";
import { EUserType } from "./interfaces";

export const getDummyUser = (walletMetadata: TWalletMetadata) => ({
  userId: "user-id" as EthereumAddressWithChecksum,
  type: EUserType.INVESTOR,
  walletType: walletMetadata.walletType,
  walletSubtype: walletMetadata.walletSubType,
});
