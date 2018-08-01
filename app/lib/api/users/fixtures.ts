import { WalletSubType, WalletType } from '../../../modules/web3/types';
import { TUserType } from "./interfaces";

export const getDummyUser = () => ({
  type: "investor" as TUserType,
  walletType: "light" as WalletType,
  walletSubtype: "unknown" as WalletSubType
});
