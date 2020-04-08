import { clearSafeTimeout, safeSetTimeout } from "@neufund/shared";
import WalletConnectSubprovider from "@walletconnect/web3-subprovider";
import { EventEmitter } from "events";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { ILogger } from "../../../../../shared-modules/dist/modules/core/lib/logger/ILogger";
import { WC_DEFAULT_SESSION_REQUEST_TIMEOUT } from "../../../config/constants";
import { symbols } from "../../../di/symbols";
import { NullBlockTracker } from "../../api/nullBlockTracker";
import { IPersonalWallet } from "../PersonalWeb3";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import { WalletConnectSessionRejectedError, WalletConnectWallet } from "./WalletConnectWallet";

export type TWalletConnectEvents =
  | { type: EWalletConnectEventTypes.SESSION_REQUEST; payload: { uri: string } }
  | { type: EWalletConnectEventTypes.SESSION_REQUEST_TIMEOUT }
  | { type: EWalletConnectEventTypes.DISCONNECT }
  | { type: EWalletConnectEventTypes.REJECT }
  | { type: EWalletConnectEventTypes.CONNECT }
  | { type: EWalletConnectEventTypes.ERROR; payload: { error: Error } }
  | { type: EWalletConnectEventTypes.ACCOUNTS_CHANGED; payload: { account: string } }
  | { type: EWalletConnectEventTypes.NETWORK_CHANGED; payload: { networkId: number } }
  | { type: EWalletConnectEventTypes.CHAIN_CHANGED; payload: { chainId: number } };

export enum EWalletConnectEventTypes {
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  REJECT = "reject",
  ACCOUNTS_CHANGED = "accountsChanged",
  CHAIN_CHANGED = "chainChanged",
  NETWORK_CHANGED = "networkChanged",
  OPEN = "open",
  CLOSE = "close",
  ERROR = "error",
  PAYLOAD = "payload",
  SESSION_REQUEST = "sessionRequest",
  SESSION_REQUEST_TIMEOUT = "sessionRequestTimeout",
}


@injectable()
export class WalletConnectConnector extends EventEmitter {
  private web3?: Web3;
  private walletConnectProvider: typeof WalletConnectSubprovider | undefined;
  private sessionRequestTimeout: number | undefined;

  public constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly web3Config: IEthereumNetworkConfig,
    @inject(symbols.logger)
    public readonly logger: ILogger,
  ) {
    super();
  }

  public connect = async (): Promise<IPersonalWallet> => {
    let engine: any;

    this.walletConnectProvider = new WalletConnectSubprovider({
      bridge: this.web3Config.bridgeUrl,
      qrcode: true,
    });

    this.walletConnectProvider.on("sessionRequest", this.sessionRequestHandler);
    this.walletConnectProvider.on("connect", this.connectHandler);
    this.walletConnectProvider.on("disconnect", this.disconnectHandler);
    this.walletConnectProvider.on("reject", this.rejectHandler);
    this.walletConnectProvider.on("error", this.errorHandler);
    this.walletConnectProvider.on("accountsChanged", this.accountsChangedHandler);
    this.walletConnectProvider.on("chainChanged", this.chainChangedHandler);
    this.walletConnectProvider.on("networkChanged", this.networkChangedHandler);
    this.walletConnectProvider.on("open", this.openHandler); //not sure if those are used
    this.walletConnectProvider.on("close", this.closeHandler); //not sure if those are used
    this.walletConnectProvider.on("payload", this.payloadHandler); //not sure if those are used

    try {
      engine = new Web3ProviderEngine({ blockTracker: new NullBlockTracker() });

      engine.addProvider(this.walletConnectProvider);
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: this.web3Config.rpcUrl,
        }),
      );
      await this.walletConnectProvider.enable();
      engine.start();
    } catch (e) {
      this.logger.error("could not enable wc", e);
      await this.walletConnectProvider.cancelSession();
      this.cleanUpSession();
      throw new WalletConnectSessionRejectedError("subscription failed");
    }

    this.web3 = new Web3(engine);
    const web3Adapter = new Web3Adapter(this.web3);
    const ethereumAddress = await web3Adapter.getAccountAddressWithChecksum();
    this.sessionRequestTimeout && clearSafeTimeout(this.sessionRequestTimeout);
    return new WalletConnectWallet(web3Adapter, ethereumAddress);
  };

  public disconnect = async () => {
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.close();
      this.cleanUpSession();
      return "disconnected";
    } else {
      return "nothing to disconnect";
    }
  };

  public cancelSession = async () => {
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.cancelSession();
      this.cleanUpSession();
      return "canceled";
    } else {
      return "nothing to cancel";
    }
  };

  private cleanUpSession = () => {
    if (this.walletConnectProvider) {
      this.walletConnectProvider = undefined;
    }
    if (this.web3) {
      this.web3 = undefined;
    }
    if (this.sessionRequestTimeout) {
      clearSafeTimeout(this.sessionRequestTimeout);
    }
  };

  private accountsChangedHandler = (accounts: string[]) => {
    this.emit(EWalletConnectEventTypes.ACCOUNTS_CHANGED, { accounts });
  };

  private chainChangedHandler = (chainId: number) => {
    this.emit(EWalletConnectEventTypes.CHAIN_CHANGED, { chainId });
  };
  private networkChangedHandler = (networkId: number) => {
    this.emit(EWalletConnectEventTypes.NETWORK_CHANGED, { networkId });
  };

  private openHandler = () => {
    this.emit(EWalletConnectEventTypes.OPEN);
  };

  private closeHandler = (code: number, reason: string) => {
    this.emit(EWalletConnectEventTypes.CLOSE, { code, reason });
  };

  private connectHandler = () => {
    this.emit(EWalletConnectEventTypes.CONNECT);
  };

  private disconnectHandler = () => {
    this.cleanUpSession();
    this.emit(EWalletConnectEventTypes.DISCONNECT);
  };

  private rejectHandler = () => {
    this.emit(EWalletConnectEventTypes.REJECT);
  };

  private errorHandler = (error: Error) => {
    this.emit(EWalletConnectEventTypes.ERROR, { error });
  };

  private payloadHandler = (_: any) => {};

  private sessionRequestHandler = (uri: any) => {
    this.sessionRequestTimeout = safeSetTimeout(
      this.sessionRequestTimeoutHandler,
      WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
    );

    this.emit(EWalletConnectEventTypes.SESSION_REQUEST, uri);
  };

  private sessionRequestTimeoutHandler = () => {
    this.sessionRequestTimeout && clearSafeTimeout(this.sessionRequestTimeout);
    this.emit(EWalletConnectEventTypes.SESSION_REQUEST_TIMEOUT);
  };
}
