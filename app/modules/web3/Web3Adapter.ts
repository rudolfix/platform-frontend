import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";

import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { makeEthereumAddressChecksumed } from "./utils";

/**
 * Layer on top of raw Web3js. Simplifies API for common operations. Adds promise support.
 */
export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  public async getNetworkId(): Promise<EthereumNetworkId> {
    return promisify<string>(this.web3.version.getNetwork)() as any;
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify(this.web3.eth.getBalance)(address);
  }

  public async getAccountAddress(): Promise<EthereumAddress> {
    const getAccounts = promisify(this.web3.eth.getAccounts);
    const accounts = await getAccounts();
    return accounts[0] as EthereumAddress;
  }

  // returns mixed case checksumed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return makeEthereumAddressChecksumed(address);
  }

  public async ethSign(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: string,
  ): Promise<string> {
    const sign = promisify(this.web3.eth.sign);
    return sign(address, data);
  }
}
