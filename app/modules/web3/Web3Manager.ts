import { injectable } from "inversify";

import { IPersonalWallet } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export const EthereumNetworkConfig = "EthereumNetworkConfig";

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export const Web3ManagerSymbol = "Web3Manager";

// singleton holding all web3 instances
@injectable()
export class Web3Manager {
  public personalWallet?: IPersonalWallet;

  constructor(
    public readonly internalWeb3Adapter: Web3Adapter,
    public readonly networkId: string,
  ) {}

  public plugPersonalWallet(personalWallet: IPersonalWallet): void {
    this.personalWallet = personalWallet;
  }
}
