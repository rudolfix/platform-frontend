import { inject, injectable } from "inversify";
import { WalletConnectError, WalletConnectWallet } from "./WalletConnectWallet";
import { Web3Adapter } from "../Web3Adapter";
import * as Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider/src/index";
import { IPersonalWallet } from "../PersonalWeb3";
import { symbols } from "../../../di/symbols";
import { IEthereumNetworkConfig } from "../types";
import { ILogger } from "../../../../../shared-modules/dist/modules/core/lib/logger/ILogger";
import { BrowserWalletError } from "../browser-wallet/BrowserWallet";

@injectable()
export class WalletConnectConnector {
  private web3?: Web3;
  public constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly web3Config: IEthereumNetworkConfig,
    @inject(symbols.logger)
    public readonly logger: ILogger,
  ) {}

  public connect = async (): Promise<IPersonalWallet> => {
    console.log("connecting...");

    const provider = new WalletConnectProvider({
      // bridge: "wss://platform.neufund.io/api/wc-bridge-socket/",
      bridge: "ws://localhost:5021",
      qrCode: true,
      rpc: this.web3Config.rpcUrl
    });

    console.log("--provider", provider.enable);
//  Enable session (triggers QR Code modal)
    try {
      await provider.enable();
    } catch(e){
      console.log('could not enable wc,',e )
      throw new WalletConnectError("subscription failed")
    }

    this.web3 = new Web3(provider);
    console.log("provider",provider);

    const web3Adapter = new Web3Adapter(this.web3);
    console.log("web3Adapter", web3Adapter);

    const ethereumAddress =  await web3Adapter.getAccountAddress();
    console.log("ethereumAddress", ethereumAddress);
;
    return new WalletConnectWallet(web3Adapter,ethereumAddress)
  }
}
