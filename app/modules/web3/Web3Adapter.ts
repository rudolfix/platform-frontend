import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";
import * as Eip55 from "eip55";

import { EthereumNetworkId, EthereumAddress, EthereumAddressWithChecksum } from "../../types";
import { WalletSubType } from "./PersonalWeb3";

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

  // returns mixed case checksummed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return Eip55.encode(address) as EthereumAddressWithChecksum;
  }

  public async ethSign(address: EthereumAddress | EthereumAddressWithChecksum, data: string): Promise<string> {
    const sign = promisify(this.web3.eth.sign);
    return sign(address, data);
  }

  public async getNodeType(): Promise<WalletSubType> {
    const nodeIdString = await promisify(this.web3.version.getNode)();
    const matchNodeIdString = nodeIdString.toLowerCase();

    if (matchNodeIdString.includes("metamask")) {
      return WalletSubType.METAMASK;
    }
    if (matchNodeIdString.includes("parity")) {
      return WalletSubType.PARITY;
    }
    // @todo support for mist
    // @todo support for ledger / neukey
    return WalletSubType.UNKNOWN;
  }
}
