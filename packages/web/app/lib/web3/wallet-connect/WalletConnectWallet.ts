import { TxData } from "web3";

import { EthereumAddress } from "../../../../../shared/dist/utils/opaque-types/types";
import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { SignerTimeoutError } from "../Web3Manager/Web3Manager";

export const WC_SESSION_REQUEST_TIMEOUT = 10000;//10 * 60 * 1000;//todo move those two to config
export const WC_SIGN_TIMEOUT = 10000;//2 * 60 * 1000; //fixme

export class WalletConnectGenericError extends Error {
}

export class WalletConnectSessionRejectedError extends Error {
}


export class WalletConnectWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
  ) {
  }

  public readonly walletType = EWalletType.UNKNOWN;
  public readonly walletSubType = EWalletSubType.UNKNOWN;
  public readonly sendTransactionMethod = 'eth_sendTransaction';
  public readonly signerType = SignerType.ETH_SIGN;

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

    const signingTimeout:Promise<string> = new Promise(function (_, rej) {
      setTimeout(rej, WC_SIGN_TIMEOUT, new SignerTimeoutError());
    });

    return await Promise.race([
      this.web3Adapter.ethSign(this.ethereumAddress, dataToSign),
      signingTimeout
    ]);
  }

  public async sendTransaction(txData: TxData): Promise<string> {
    console.log("sendTransaction", txData);
    try {
      return await this.web3Adapter.sendTransaction(txData);
    } catch (e) {
      console.log("walletConnect.sendTransaction error:", e);
      throw e; //fixme add normal TMessage errors
    }
  }

  public getMetadata(): IWalletConnectMetadata {
    return {
      address: this.ethereumAddress,
      walletType: this.walletType,
      walletSubType: this.walletSubType,
      sendTransactionMethod: this.sendTransactionMethod,
      signerType: this.signerType,
      sessionRequestTimeout: WC_SESSION_REQUEST_TIMEOUT,
      signTimeout: WC_SIGN_TIMEOUT
    }
  }

  public isUnlocked(): boolean {
    return true;
  }
}
