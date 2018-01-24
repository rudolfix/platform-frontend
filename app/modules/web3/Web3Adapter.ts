import { BigNumber } from "bignumber.js";
import { promisify } from "bluebird";
import * as Web3 from "web3";
import { EthereumNetworkId } from "../../types";
import { WalletSubType } from "./PersonalWeb3";

export class Web3Adapter {
  constructor(public readonly web3: Web3) {}

  public async getNetworkId(): Promise<EthereumNetworkId> {
    return promisify<string>(this.web3.version.getNetwork)() as any;
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify<BigNumber, string>(this.web3.eth.getBalance)(address);
  }

  public async getAccountAddress(): Promise<string> {
    const getAccounts = promisify<string[]>(this.web3.eth.getAccounts);
    const accounts = await getAccounts();
    return accounts[0];
  }

  public async getNodeType(): Promise<WalletSubType> {
    const nodeIdString = await promisify<string>(this.web3.version.getNode)();
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
