import { EthereumPrivateKey } from "@neufund/shared-utils";

export enum EWalletUIType {
  MNEMONIC,
  PRIVATE_KEY,
}

export type TWalletUI =
  | {
      type: EWalletUIType.MNEMONIC;
      value: string[];
    }
  | {
      type: EWalletUIType.PRIVATE_KEY;
      value: EthereumPrivateKey;
    };
