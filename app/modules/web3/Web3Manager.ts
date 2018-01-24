import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { EthereumNetworkId } from "../../types";
import { IPersonalWallet } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export const IEthereumNetworkConfigSymbol = "EthereumNetworkConfig";

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
  public networkId: EthereumNetworkId;
  public internalWeb3Adapter: Web3Adapter;

  constructor(
    @inject(IEthereumNetworkConfigSymbol)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
  ) {}

  public async initialize(): Promise<void> {
    const rawWeb3 = new Web3(new Web3.providers.HttpProvider(this.ethereumNetworkConfig.rpcUrl));
    this.internalWeb3Adapter = new Web3Adapter(rawWeb3);
    this.networkId = await this.internalWeb3Adapter.getNetworkId();
  }

  public async plugPersonalWallet(personalWallet: IPersonalWallet): Promise<void> {
    const isWalletConnected = await personalWallet.testConnection(this.networkId);
    if (!isWalletConnected) {
      throw new WalletNotConnectedError(personalWallet);
    }

    this.personalWallet = personalWallet;
  }
}
