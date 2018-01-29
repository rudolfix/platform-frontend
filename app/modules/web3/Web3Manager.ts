import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { DispatchSymbol } from "../../getContainer";
import { AppDispatch } from "../../store";
import { EthereumNetworkId } from "../../types";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactorySymbol,
  AsyncIntervalSchedulerFactoryType,
} from "../../utils/AsyncIntervalScheduler";
import { ILogger, LoggerSymbol } from "../../utils/Logger";
import { newPersonalWalletPluggedAction, personalWalletDisconnectedAction } from "./actions";
import { IPersonalWallet } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export const IEthereumNetworkConfigSymbol = "EthereumNetworkConfig";

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export const Web3ManagerSymbol = "Web3Manager";

export class WalletNotConnectedError extends Error {
  constructor(public readonly wallet: IPersonalWallet) {
    super("Wallet not connected");
  }
}

export const WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL = 1000;

// singleton holding all web3 instances
@injectable()
export class Web3Manager {
  public personalWallet?: IPersonalWallet;
  public networkId: EthereumNetworkId;
  public internalWeb3Adapter: Web3Adapter;

  private readonly web3ConnectionWatcher: AsyncIntervalScheduler;

  constructor(
    @inject(IEthereumNetworkConfigSymbol)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
    @inject(DispatchSymbol) public readonly dispatch: AppDispatch,
    @inject(LoggerSymbol) public readonly logger: ILogger,
    @inject(AsyncIntervalSchedulerFactorySymbol)
    asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType,
  ) {
    this.web3ConnectionWatcher = asyncIntervalSchedulerFactory(
      this.watchConnection,
      WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    );
  }

  public async initialize(): Promise<void> {
    const rawWeb3 = new Web3(new Web3.providers.HttpProvider(this.ethereumNetworkConfig.rpcUrl));
    this.internalWeb3Adapter = new Web3Adapter(rawWeb3);
    this.networkId = await this.internalWeb3Adapter.getNetworkId();
  }

  public async plugPersonalWallet(personalWallet: IPersonalWallet): Promise<void> {
    const isWalletConnected = await personalWallet.testConnection(this.networkId);
    if (!isWalletConnected) {
      throw new WalletNotConnectedError(personalWallet);
    }

    this.personalWallet = personalWallet;

    this.dispatch(
      newPersonalWalletPluggedAction({
        type: personalWallet.type,
        subtype: personalWallet.subType,
      }),
    );

    this.web3ConnectionWatcher.start();
  }

  private watchConnection = async () => {
    this.logger.debug("Checking web3 status...");
    if (!this.personalWallet) {
      this.logger.error("Web3 watcher started without valid personalWallet instance!");
      return;
    }
    if (!await this.personalWallet.testConnection(this.networkId)) {
      this.onWeb3ConnectionLost();
    }
  };

  private onWeb3ConnectionLost = () => {
    this.logger.info("Web3 connection lost");
    this.dispatch(personalWalletDisconnectedAction());

    this.web3ConnectionWatcher.stop();
  };
}
