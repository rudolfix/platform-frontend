import { TxData } from "web3";

import { EthereumAddress } from "../../../../../shared/dist/utils/opaque-types/types";
import {
  EWalletSubType,
  EWalletType,
  IWalletConnectMetadata
} from "../../../modules/web3/types";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";

export class WalletConnectError extends Error {}

export class WalletConnectWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
  ) {
  }

  public readonly walletType = EWalletType.WALLET_CONNECT;
  public readonly walletSubType = EWalletSubType.UNKNOWN;

  public getSignerType(): SignerType {
    console.log("getSignerType");
    return SignerType.ETH_SIGN;
  }

  public async testConnection(networkId: string): Promise<boolean> {
    console.log("testConnection");
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }
    return !!(await this.web3Adapter.getAccountAddress());
  }

  public async signMessage(data: string): Promise<string> {
    console.log("signMessage", data);
    const dataDecoded = [{
      type: "",
      name: "",
      value: "",
    }];

    return await this.web3Adapter.signTypedData(this.ethereumAddress, dataDecoded)
  }

  public async sendTransaction(txData: TxData): Promise<string> {
    console.log("sendTransaction", txData);
    try {
      return await this.web3Adapter.sendTransaction(txData);
    } catch (e) {
      console.log("walletConnect.sendTransaction error:", e);
      throw e; //todo add errors
    }
  }

  public getMetadata(): IWalletConnectMetadata {
    console.log("getMetadata");
    return {
      address: this.ethereumAddress,
      walletType: this.walletType,

    }
  }

  public isUnlocked(): boolean {
    console.log("isUnlocked");
    return true;
  }
}
