import { TxData } from "web3";

import { EthereumAddress } from "../../../../../shared/dist/utils/opaque-types/types";
import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";

export class WalletConnectGenericError extends Error {}
export class WalletConnectSessionRejectedError extends Error {}

export class WalletConnectWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
  ) {
  }

  public readonly walletType = EWalletType.UNKNOWN;
  public readonly walletSubType = EWalletSubType.UNKNOWN;
  public readonly sendTransactionMethod ='eth_sendTransaction';
  public readonly signerType = SignerType.ETH_SIGN;
  public readonly sessionTimeout = 10 * 60 * 1000;
  public readonly signTimeout = 2 * 60 * 1000;

  public getSignerType(): SignerType {
    console.log("getSignerType");
    return this.signerType;
  }

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }
    return !!(await this.web3Adapter.getAccountAddress());
  }

  public async signMessage(data: string): Promise<string> {
    const msgHash = hashPersonalMessage(toBuffer(addHexPrefix(data)));
    const dataToSign = addHexPrefix(msgHash.toString("hex"));

    return await this.web3Adapter.ethSign(this.ethereumAddress,dataToSign)
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
    return {
      address: this.ethereumAddress,
      walletType: this.walletType,
      walletSubType: this.walletSubType,
      sendTransactionMethod: this.sendTransactionMethod,
      signerType: this.signerType,
      sessionTimeout: this.sessionTimeout,
      signTimeout: this.signTimeout
    }
  }

  public isUnlocked(): boolean {
    return true;
  }
}
