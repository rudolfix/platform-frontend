import WalletConnectProvider from "@walletconnect/packages/providers/web3-provider";
import { EventEmitter } from "events";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { ILogger } from "../../../../../shared-modules/dist/modules/core/lib/logger/ILogger";
import { symbols } from "../../../di/symbols";
import { IPersonalWallet } from "../PersonalWeb3";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import { WalletConnectError, WalletConnectWallet } from "./WalletConnectWallet";

export type TWalletConnectEvents =
  | {type: EWalletConnectEventTypes.DISCONNECT}
  | {type: EWalletConnectEventTypes.REJECT}
  | {type: EWalletConnectEventTypes.CONNECT}
  | {type: EWalletConnectEventTypes.ERROR, payload: {error:Error}}

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
}

//todo move to config
const devBridgeUrl = "ws://localhost:5021";

@injectable()
export class WalletConnectConnector extends EventEmitter {
  private web3?: Web3;
  private provider?: WalletConnectProvider;

  public constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly web3Config: IEthereumNetworkConfig,
    @inject(symbols.logger)
    public readonly logger: ILogger,
  ) {
    super();
  }

  public connect = async (): Promise<IPersonalWallet> => {
    this.provider = new WalletConnectProvider({
      bridge: devBridgeUrl,
      qrcode: true,
      rpc: { 14: this.web3Config.rpcUrl },
      chainId: 14
    });

    this.provider.on("accountsChanged", this.accountsChangedHandler);
    this.provider.on("chainChanged", this.chainChangedHandler);
    this.provider.on("networkChanged", this.networkChangedHandler);
    this.provider.on("open", this.openHandler); //not sure if those are used
    this.provider.on("close", this.closeHandler);//not sure if those are used
    this.provider.on("connect", this.connectHandler);
    this.provider.on("disconnect", this.disconnectHandler);
    this.provider.on("reject", this.rejectHandler);
    this.provider.on("error", this.errorHandler);
    this.provider.on("payload", this.payloadHandler);

    try {
      await this.provider.enable();
    } catch (e) {
      this.provider = undefined;
      this.web3 = undefined;

      console.log('could not enable wc,', e);
      throw new WalletConnectError("subscription failed")
    }

    this.web3 = new Web3(this.provider as any); //todo fix typings in walletConnect
    const web3Adapter = new Web3Adapter(this.web3);
    const ethereumAddress = await web3Adapter.getAccountAddress();

    return new WalletConnectWallet(web3Adapter, ethereumAddress)
  };

  public disconnect = () => {
    if (this.provider) {
      this.provider.close();
      this.cleanUpSession();
      return "disconnected"
    } else {
      return "nothing to disconnect"
    }
  };

  private cleanUpSession = () => {
    if (this.provider) {
      this.provider = undefined;
      this.web3 = undefined
    }
  };

  private accountsChangedHandler = (accounts: string[]) => {
    console.log("accountsChanged event", accounts);
    this.emit(EWalletConnectEventTypes.ACCOUNTS_CHANGED,{accounts} )
  };

  private chainChangedHandler = (chainId: number) => {
    console.log("chainChanged event", chainId);
    this.emit(EWalletConnectEventTypes.CHAIN_CHANGED,{chainId} )
  };
  private networkChangedHandler = (networkId: number) => {
    console.log("networkChanged event", networkId);
    this.emit(EWalletConnectEventTypes.NETWORK_CHANGED,{networkId} )
  };

  private openHandler = () => {
    console.log("open event");
    this.emit(EWalletConnectEventTypes.OPEN)
  };

  private closeHandler = (code: number, reason: string) => {
    console.log("close event", code, reason);
    this.emit(EWalletConnectEventTypes.CLOSE,{code,reason} )
  };

  private connectHandler = () => {
    console.log("connect event");
    this.emit(EWalletConnectEventTypes.CONNECT, )
  };

  private disconnectHandler = () => {
    console.log("disconnect event");
    this.cleanUpSession();
    this.emit(EWalletConnectEventTypes.DISCONNECT, )
  };

  private rejectHandler = () => {
    console.log("reject event");
    this.emit(EWalletConnectEventTypes.REJECT, )
  };

  private errorHandler = (error:Error) => {
    console.log("error event", error);
    this.emit(EWalletConnectEventTypes.ERROR,{error} )
  };

  private payloadHandler = (payload:any) => {
    console.log("paylaod event", payload);
  };
}
