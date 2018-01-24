import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";

export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  async networkId(): Promise<string> {
    return promisify<string>(this.web3.version.getNetwork)();
  }

  async getBalance(address: string): Promise<BigNumber> {
    return promisify<BigNumber, string>(this.web3.eth.getBalance)(address);
  }
}
