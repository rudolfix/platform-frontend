import { EUserType, EWalletSubType, EWalletType } from "../module";

export type TMetadata =
  | {
      userType: EUserType;
      walletType: EWalletType.LIGHT;
      walletSubType: EWalletSubType.UNKNOWN;
      email: string;
      salt: string;
    }
  | {
      userType: EUserType;
      walletType: Exclude<EWalletType, EWalletType.LIGHT>;
      walletSubType: EWalletSubType;
    };
