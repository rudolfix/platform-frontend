import { addHexPrefix } from "ethereumjs-util";
import * as Web3 from "web3";

import { EWalletSubType, EWalletType } from "../../../modules/web3/types";
import { EthereumAddress } from "../../../types";
import { ILedgerWalletMetadata } from "../../persistence/WalletMetadataObjectStorage";
import { IPersonalWallet, SignerType } from "../PersonalWeb3";
import { Web3Adapter } from "../Web3Adapter";
import { SignerRejectConfirmationError, SignerTimeoutError } from "../Web3Manager";
import { LedgerConfirmationRejectedError, LedgerTimeoutError, parseLedgerError } from "./errors";
import { testConnection } from "./ledgerUtils";
import { IHookedWalletSubProvider } from "./types";

const CHECK_INTERVAL = 1000;

export class LedgerWallet implements IPersonalWallet {
  public readonly walletType = EWalletType.LEDGER;
  public readonly walletSubType = EWalletSubType.UNKNOWN; // in future we may detect if it's pure ledger or Neukey
  waitingForCommand = false; // if ledger is waiting for user interaction it is blocked and you should not send any instructions to it.

  public constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
    private readonly ledgerInstance: IHookedWalletSubProvider | undefined,
    public readonly derivationPath: string,
  ) {}

  public getSignerType(): SignerType {
    return SignerType.ETH_SIGN;
  }

  public async testConnection(): Promise<boolean> {
    if (this.waitingForCommand) {
      return true;
    }
    return testConnection(this.ledgerInstance);
  }

  public async signMessage(data: string): Promise<string> {
    try {
      this.waitingForCommand = true;
      debugger;
      const message = await this.ledgerInstance!.signPersonalMessage({
        from: this.ethereumAddress,
        data: addHexPrefix(data),
      });
      debugger;
      return message;
    } catch (e) {
      const ledgerError = parseLedgerError(e);
      if (ledgerError instanceof LedgerConfirmationRejectedError) {
        throw new SignerRejectConfirmationError();
      } else if (ledgerError instanceof LedgerTimeoutError) {
        throw new SignerTimeoutError();
      } else {
        throw ledgerError;
      }
    } finally {
      this.waitingForCommand = false;
    }
  }

  public getMetadata(): ILedgerWalletMetadata {
    return {
      address: this.ethereumAddress,
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      derivationPath: this.derivationPath,
    };
  }

  public async sendTransaction(data: Web3.TxData): Promise<string> {
    try {
      return await this.web3Adapter.sendTransaction(data);
    } catch (e) {
      const ledgerError = parseLedgerError(e);
      if (ledgerError instanceof LedgerConfirmationRejectedError) {
        throw new SignerRejectConfirmationError();
      } else if (ledgerError instanceof LedgerTimeoutError) {
        throw new SignerTimeoutError();
      } else {
        throw ledgerError;
      }
    } finally {
      this.waitingForCommand = false;
    }
  }
}
