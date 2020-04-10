import { clearSafeTimeout, EthereumAddressWithChecksum, safeSetTimeout } from "@neufund/shared";
import { ESignerType } from "@neufund/shared-modules";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { TxData } from "web3";

import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { TPeerMeta } from "../../persistence/WalletConnectStorage";
import { WalletError } from "../errors";
import { IPersonalWallet } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { SignerTimeoutError } from "../Web3Manager/Web3Manager";
import { generateWalletMetaFormPeerMeta, TWcMeta } from "./utils";

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
    peerMeta: TPeerMeta | null,
  ) {
    this.walletMeta = generateWalletMetaFormPeerMeta(peerMeta);
    this.walletSubType = this.walletMeta.walletSubType;
  }

  public readonly walletType = EWalletType.WALLETCONNECT;
  public readonly walletSubType: EWalletSubType;
  private readonly walletMeta: TWcMeta;

  public getSignerType(): ESignerType {
    return this.walletMeta.signerType;
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

    const signingTimeoutPromise = (signingTimeout: number): Promise<string> =>
      new Promise((_, reject) => {
        const timeout = safeSetTimeout(() => {
          clearSafeTimeout(timeout);
          reject(new SignerTimeoutError());
        }, signingTimeout);
      });
    return await Promise.race([
      this.web3Adapter.ethSign(this.ethereumAddress, dataToSign),
      signingTimeoutPromise(this.walletMeta.signingTimeout),
    ]);
  }

  public async sendTransaction(txData: TxData): Promise<string> {
    try {
      return await this.web3Adapter.sendTransaction(txData);
    } catch (e) {
      throw new WalletConnectSessionTransactionError(`Could not send transaction. ${e.toString()}`);
    }
  }

  public getMetadata(): IWalletConnectMetadata {
    return {
      address: this.ethereumAddress,
      walletType: this.walletType,
      ...this.walletMeta,
    };
  }

  public isUnlocked(): boolean {
    return true;
  }
}
