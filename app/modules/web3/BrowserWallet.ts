import { injectable } from "inversify";
import * as Web3 from "web3";
import { EthereumNetworkId } from "../../types";
import { IPersonalWallet, WalletSubType, WalletType } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export class BrowserWalletError extends Error {}
export class BrowserWalletMissingError extends BrowserWalletError {}
export class BrowserWalletMismatchedNetworkError extends BrowserWalletError {
  constructor(
    public readonly desiredNetworkId: EthereumNetworkId,
    public readonly actualNetworkId: EthereumNetworkId,
  ) {
    super("MismatchedNetworkError");
  }
}
export class BrowserWalletLockedError extends BrowserWalletError {}

export const BrowserWalletSymbol = "BrowserWallet";

@injectable()
export class BrowserWallet implements IPersonalWallet {
  public readonly type = WalletType.BROWSER;
  public subType = WalletSubType.UNKNOWN;
  public web3?: Web3;
  private web3Adapter: Web3Adapter;

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }

    return !!await this.web3Adapter.getAccountAddress();
  }

  public async connect(networkId: EthereumNetworkId): Promise<void> {
    const newInjectedWeb3 = (window as any).web3;
    if (typeof newInjectedWeb3 === "undefined") {
      throw new BrowserWalletMissingError();
    }
    const newWeb3 = new Web3(newInjectedWeb3.currentProvider);

    const web3Adapter = new Web3Adapter(newWeb3);
    // check for mismatched networkIds
    const personalWeb3NetworkId = await web3Adapter.getNetworkId();
    if (networkId !== personalWeb3NetworkId) {
      throw new BrowserWalletMismatchedNetworkError(networkId, personalWeb3NetworkId);
    }

    // check for locked wallet
    if (!await web3Adapter.getAccountAddress()) {
      throw new BrowserWalletLockedError();
    }

    this.subType = await web3Adapter.getNodeType();

    this.web3 = newWeb3;
    this.web3Adapter = web3Adapter;
  }
}
