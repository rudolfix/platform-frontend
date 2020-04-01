import { clearSafeTimeout, EthereumAddressWithChecksum, safeSetTimeout } from "@neufund/shared";
import { ESignerType } from "@neufund/shared-modules";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { TxData } from "web3";

import { WC_DEFAULT_SESSION_REQUEST_TIMEOUT, WC_DEFAULT_SIGN_TIMEOUT } from "../../../config/constants";
import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { WalletError } from "../errors";
import { IPersonalWallet } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { SignerTimeoutError } from "../Web3Manager/Web3Manager";

export class WalletConnectGenericError extends WalletError {
  constructor(message: string) {
    super(`WalletConnect: ${message}`);
  }
}

export class WalletConnectSessionRejectedError extends WalletError {
  constructor(message: string) {
    super(`WalletConnect: sessionRequest rejected. ${message}`);
  }
}

export class WalletConnectSessionTransactionError extends WalletError {
  constructor(message: string) {
    super(`WalletConnect: transaction error. ${message}`);
  }
}

export class WalletConnectWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddressWithChecksum,
  ) {
  }

  public readonly walletType = EWalletType.WALLETCONNECT;
  public readonly walletSubType = EWalletSubType.UNKNOWN;
  public readonly sendTransactionMethod = 'eth_sendTransaction';
  public readonly signerType = ESignerType.ETH_SIGN;
  public readonly singingTimeout = WC_DEFAULT_SIGN_TIMEOUT;
  public readonly sessionRequestTimeout = WC_DEFAULT_SESSION_REQUEST_TIMEOUT;

  public getSignerType(): ESignerType {
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

    const signingTimeoutPromise = (signingTimeout: number): Promise<string> => new Promise(
      (_, reject) => {
        const timeout = safeSetTimeout(() => {
          clearSafeTimeout(timeout);
          reject(new SignerTimeoutError())
        }, signingTimeout)
      }
    );
    return await Promise.race([
      this.web3Adapter.ethSign(this.ethereumAddress, dataToSign),
      signingTimeoutPromise(this.singingTimeout)
    ]);
  }

  public async sendTransaction(txData: TxData): Promise<string> {
    try {
      return await this.web3Adapter.sendTransaction(txData);
    } catch (e) {
      console.log("walletConnect.sendTransaction error:", e);
      throw new WalletConnectSessionTransactionError(`Could not send transaction. ${e.toString()}`)
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
