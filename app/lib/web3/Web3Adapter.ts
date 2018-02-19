import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";

import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";

/**
 * Layer on top of raw Web3js. Simplifies API for common operations. Adds promise support.
 * Note that some methods may be not supported correctly by exact implementation of your client
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

  // returns mixed case checksummed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return makeEthereumAddressChecksummed(address);
  }

  public async ethSign(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: string,
  ): Promise<string> {
    const sign = promisify(this.web3.eth.sign);
    return sign(address, data);
  }

  public async signTypedData(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: ITypedDataToSign[],
  ): Promise<string> {
    const send = promisify<any, any>(
      this.web3.currentProvider.sendAsync.bind(this.web3.currentProvider),
    ); // web3 typings are not accurate here

    const resultData = await send({
      method: "eth_signTypedData",
      params: [data, address as string],
      from: address as string,
    });

    return resultData.result;
  }
}

interface ITypedDataToSign {
  type: string; // todo: here we could use more specific type. Something like "string" | "uint32" etc.
  name: string;
  value: string;
}
