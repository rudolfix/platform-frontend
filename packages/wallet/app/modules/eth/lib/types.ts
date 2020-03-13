import { EthereumAddress, EthereumName } from "@neufund/shared";
import { utils } from "ethers";

export enum EBlockTag {
  PENDING = "pending",
  LATEST = "latest",
}

/**
 * Only allows string and BigNumber
 * We found that working with numbers is quite error prone due to overflows.
 */
export type TBigNumberVariants = string | utils.BigNumber;

export type TTransactionRequestRequired = {
  to: EthereumAddress | EthereumName;
  // TODO: Validate whether from is equal to the address associated with EthWallet
  from: EthereumAddress;
  // TODO: hide under `EthManager` so there is not need to pass it from saga
  gasLimit: TBigNumberVariants;
  // TODO: hide under `EthManager` so there is not need to pass it from saga
  gasPrice: TBigNumberVariants;
  data?: string;
  value?: TBigNumberVariants;
};

export enum EWalletType {
  HD_WALLET = "HD_WALLET",
  PRIVATE_KEY_WALLET = "PRIVATE_KEY_WALLET",
}
