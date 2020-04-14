import { EthereumAddressWithChecksum } from "@neufund/shared-utils";

import { ESignerType } from "./types";

interface IEthManager {
  hasPluggedWallet(): Promise<boolean>;

  getWalletSignerType(): Promise<ESignerType>;

  signMessage(message: string): Promise<string>;

  getWalletAddress(): Promise<EthereumAddressWithChecksum>;
}

export { IEthManager };
