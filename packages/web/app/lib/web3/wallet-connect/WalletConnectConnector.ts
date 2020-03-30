import WalletConnectSubprovider from "@walletconnect/packages/providers/web3-subprovider";
import { EventEmitter } from "events";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { ILogger } from "../../../../../shared-modules/dist/modules/core/lib/logger/ILogger";
import { symbols } from "../../../di/symbols";
import { NullBlockTracker } from "../../api/nullBlockTracker";
import { IPersonalWallet } from "../PersonalWeb3";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import {
  WalletConnectSessionRejectedError,
  WalletConnectWallet,
  WC_DEFAULT_SESSION_REQUEST_TIMEOUT
} from "./WalletConnectWallet";

export type TWalletConnectEvents =
  | { type: EWalletConnectEventTypes.SESSION_REQUEST, payload: { uri: string } }
  | { type: EWalletConnectEventTypes.DISCONNECT }
  | { type: EWalletConnectEventTypes.REJECT }
  | { type: EWalletConnectEventTypes.CONNECT }
  | { type: EWalletConnectEventTypes.ERROR, payload: { error: Error } }
  | { type: EWalletConnectEventTypes.ACCOUNTS_CHANGED, payload: {account: string} }
  | { type: EWalletConnectEventTypes.NETWORK_CHANGED, payload: {networkId: number} }
  | { type: EWalletConnectEventTypes.CHAIN_CHANGED, payload: {chainId: number} }

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
  private walletConnectProvider: WalletConnectSubprovider | undefined;
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
    this.walletConnectProvider.on('connect', this.connectHandler);
    this.walletConnectProvider.on("disconnect", this.disconnectHandler);
    this.walletConnectProvider.on("reject", this.rejectHandler);
    this.walletConnectProvider.on("error", this.errorHandler);
    this.walletConnectProvider.on("accountsChanged", this.accountsChangedHandler);
    this.walletConnectProvider.on("chainChanged", this.chainChangedHandler);
    this.walletConnectProvider.on("networkChanged", this.networkChangedHandler);
    this.walletConnectProvider.on("open", this.openHandler); //not sure if those are used
    this.walletConnectProvider.on("close", this.closeHandler);//not sure if those are used
    this.walletConnectProvider.on("payload", this.payloadHandler);//not sure if those are used

    try {
      engine = new Web3ProviderEngine({ blockTracker: new NullBlockTracker() });

      engine.addProvider(this.walletConnectProvider);
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: this.web3Config.rpcUrl,
        }),
      );
      await  this.walletConnectProvider.enable();
      engine.start();
    } catch (e) {
      this.logger.error("could not enable wc", e);
      console.log('could not enable wc,', e);
      this.cleanUpSession();
      engine.stop();
      throw new WalletConnectSessionRejectedError("subscription failed");
    }

    this.web3 = new Web3(engine);
    const web3Adapter = new Web3Adapter(this.web3);
    const ethereumAddress = await web3Adapter.getAccountAddress();

    return new WalletConnectWallet(web3Adapter, ethereumAddress)
  };

  public disconnect = async () => {
    if (this.walletConnectProvider) {
      await this.walletConnectProvider.close();
      this.cleanUpSession();
      return "disconnected"
    } else {
      return "nothing to disconnect"
    }
  };

  private cleanUpSession = () => {
    if (this.walletConnectProvider) {
      this.walletConnectProvider = undefined;
    }
    if (this.web3) {
      this.web3 = undefined
    }
  };

  private accountsChangedHandler = (accounts: string[]) => {
    console.log("accountsChanged event", accounts);
    this.emit(EWalletConnectEventTypes.ACCOUNTS_CHANGED, { accounts })
  };

  private chainChangedHandler = (chainId: number) => {
    console.log("chainChanged event", chainId);
    this.emit(EWalletConnectEventTypes.CHAIN_CHANGED, { chainId })
  };
  private networkChangedHandler = (networkId: number) => {
    console.log("networkChanged event", networkId);
    this.emit(EWalletConnectEventTypes.NETWORK_CHANGED, { networkId })
  };

  private openHandler = () => {
    console.log("open event");
    this.emit(EWalletConnectEventTypes.OPEN)
  };

  private closeHandler = (code: number, reason: string) => {
    console.log("close event", code, reason);
    this.emit(EWalletConnectEventTypes.CLOSE, { code, reason })
  };

  private connectHandler = () => {
    console.log("connect event");
    this.emit(EWalletConnectEventTypes.CONNECT,)
  };

  private disconnectHandler = () => {
    console.log("disconnect event");
    this.cleanUpSession();
    this.emit(EWalletConnectEventTypes.DISCONNECT,)
  };

  private rejectHandler = () => {
    console.log("reject event");
    this.emit(EWalletConnectEventTypes.REJECT,)
  };

  private errorHandler = (error: Error) => {
    console.log("error event", error);
    this.emit(EWalletConnectEventTypes.ERROR, { error })
  };

  private payloadHandler = (payload: any) => {
    console.log("paylaod event", payload);
  };

  private sessionRequestHandler = (uri: any) => {
    console.log("session request event", uri);
    this.sessionRequestTimeout = window.setTimeout(
      this.sessionRequestTimeoutHandler,
      WC_DEFAULT_SESSION_REQUEST_TIMEOUT
    );

    this.emit(EWalletConnectEventTypes.SESSION_REQUEST, uri)
  };

  private sessionRequestTimeoutHandler = () => {
    console.log("session request timeout event");
    window.clearTimeout(this.sessionRequestTimeout);
    this.emit(EWalletConnectEventTypes.SESSION_REQUEST_TIMEOUT);
  };
}
