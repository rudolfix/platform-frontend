import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { TxData } from "web3";

import { EthereumAddress } from "../../../../../shared/dist/utils/opaque-types/types";
import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { SignerTimeoutError } from "../Web3Manager/Web3Manager";

export const WC_DEFAULT_SESSION_REQUEST_TIMEOUT = 10000;//todo move those two to config //10 * 60 * 1000;
export const WC_DEFAULT_SIGN_TIMEOUT = 10000; //fixme //2 * 60 * 1000;

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
  public readonly singingTimeout = WC_DEFAULT_SIGN_TIMEOUT;
  public readonly sessionRequestTimeout = WC_DEFAULT_SESSION_REQUEST_TIMEOUT;

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

    const signingTimeoutPromise = (singingTimeout: number): Promise<string> => new Promise(
      (_, reject) => {
        const timeout = window.setTimeout(() => {
          window.clearTimeout(timeout);
          reject(new SignerTimeoutError())
        }, singingTimeout,);
      });

    return await Promise.race([
      this.web3Adapter.ethSign(this.ethereumAddress, dataToSign),
      signingTimeoutPromise(this.singingTimeout)
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
      sessionRequestTimeout: this.sessionRequestTimeout,
      signTimeout: this.singingTimeout
    }
  }

  public isUnlocked(): boolean {
    return true;
  }
}
