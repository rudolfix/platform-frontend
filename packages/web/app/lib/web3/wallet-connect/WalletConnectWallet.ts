import { clearSafeTimeout, EthereumAddressWithChecksum, safeSetTimeout } from "@neufund/shared";
import { ESignerType } from "@neufund/shared-modules";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { TxData } from "web3";

import { WC_DEFAULT_SESSION_REQUEST_TIMEOUT, WC_DEFAULT_SIGN_TIMEOUT } from "../../../config/constants";
import { EWalletSubType, EWalletType, IWalletConnectMetadata } from "../../../modules/web3/types";
import { TPeerMeta } from "../../persistence/WalletConnectStorage";
import { WalletError } from "../errors";
import { IPersonalWallet } from "../PersonalWeb3";
import { ESignTransactionMethod } from "../types";
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

type TWcMeta = {
  walletSubType: EWalletSubType.UNKNOWN | EWalletSubType.METAMASK | EWalletSubType.NEUFUND;
  sendTransactionMethod: ESignTransactionMethod,
  signerType: ESignerType;
  sessionRequestTimeout: number;
  signingTimeout: number;
  supportsExplicitTimeouts: boolean;
  supportSessionPings: boolean;
  supportsRemoteKyc: boolean;
  supportsWalletMigration: boolean
}


const generateWalletMetaFormPeerMeta = (peerMeta: TPeerMeta | null):TWcMeta => {
  const walletMeta = {
    walletSubType: EWalletSubType.UNKNOWN as EWalletSubType.UNKNOWN | EWalletSubType.METAMASK | EWalletSubType.NEUFUND,
    sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
    signerType: ESignerType.ETH_SIGN,
    signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
    sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
    supportsExplicitTimeouts: false,
    supportSessionPings: false,
    supportsRemoteKyc: false,
    supportsWalletMigration: false,
  };

  if (peerMeta !== null && peerMeta.name === 'Metamask') { //fixme find it out
    walletMeta.walletSubType = EWalletSubType.METAMASK;
    walletMeta.signerType = ESignerType.ETH_SIGN_TYPED_DATA
  } else if (peerMeta !== null && peerMeta.name === 'Neufund') {
    walletMeta.walletSubType = EWalletSubType.NEUFUND;
    walletMeta.supportsExplicitTimeouts = true;
    walletMeta.supportSessionPings = true;
    walletMeta.supportsRemoteKyc = true;
    walletMeta.supportsWalletMigration = true;
  }

  return walletMeta
};

export class WalletConnectWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddressWithChecksum,
    peerMeta: TPeerMeta | null
  ) {
    this.walletMeta = generateWalletMetaFormPeerMeta(peerMeta);
  }

  private readonly walletType = EWalletType.WALLETCONNECT;
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
      signingTimeoutPromise(this.walletMeta.signingTimeout)
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
      ...this.walletMeta
    }
  }

  public isUnlocked(): boolean {
    return true;
  }
}
