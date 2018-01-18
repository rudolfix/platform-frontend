import { injectable } from "inversify";

import { IPersonalWallet } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export const EthereumNetworkConfig = "EthereumNetworkConfig";

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export const Web3ManagerSymbol = "Web3Manager";

export class WalletNotConnectedError extends Error {
  constructor(public readonly wallet: IPersonalWallet) {
    super("Wallet not connected");
  }
}

// singleton holding all web3 instances
@injectable()
export class Web3Manager {
  public personalWallet?: IPersonalWallet;

  constructor(
    public readonly internalWeb3Adapter: Web3Adapter,
    public readonly networkId: string,
  ) {}

  public async plugPersonalWallet(personalWallet: IPersonalWallet): Promise<void> {
    const isWalletConnected = await personalWallet.testConnection(this.networkId);
    if (!isWalletConnected) {
      throw new WalletNotConnectedError(personalWallet);
    }

    this.personalWallet = personalWallet;
  }
}
