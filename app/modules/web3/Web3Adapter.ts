import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";
import { EthereumNetworkId } from "../../types";

export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  public async getNetworkId(): Promise<EthereumNetworkId> {
    return promisify<string>(this.web3.version.getNetwork)() as any;
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify<BigNumber, string>(this.web3.eth.getBalance)(address);
  }

  public async getAccountAddress(customWeb3?: any): Promise<string> {
    const getAccounts = promisify<string[]>(
      customWeb3 ? customWeb3.eth.getAccounts : this.web3.eth.getAccounts,
    );
    const accounts = await getAccounts();
    return accounts[0];
  }
}
