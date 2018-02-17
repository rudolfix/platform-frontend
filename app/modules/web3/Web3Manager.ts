export const WEB3_MANAGER_SYMBOL = Symbol();

import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { AppDispatch } from "../../store";
import { EthereumNetworkId } from "../../types";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactorySymbol,
  AsyncIntervalSchedulerFactoryType,
} from "../../utils/AsyncIntervalScheduler";
import { ILogger, LOGGER_SYMBOL } from "../../utils/Logger";
import { promiseTimeout } from "../../utils/promiseTimeout";
import { newPersonalWalletPluggedAction } from "./actions";
import { web3Flows } from "./flows";
import { IPersonalWallet } from "./PersonalWeb3";
import { Web3Adapter } from "./Web3Adapter";

export const ETHEREUM_NETWORK_CONFIG_SYMBOL = Symbol();

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export class WalletNotConnectedError extends Error {
  constructor(public readonly wallet: IPersonalWallet) {
    super("Wallet not connected");
  }
}
export class SignerError extends Error {}

export const WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL = 5000;

// singleton holding all web3 instances
@injectable()
export class Web3Manager {
  public personalWallet?: IPersonalWallet;
  public networkId: EthereumNetworkId;
  public internalWeb3Adapter: Web3Adapter;

  private readonly web3ConnectionWatcher: AsyncIntervalScheduler;

  constructor(
    @inject(ETHEREUM_NETWORK_CONFIG_SYMBOL)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
    @inject(APP_DISPATCH_SYMBOL) public readonly dispatch: AppDispatch,
    @inject(LOGGER_SYMBOL) public readonly logger: ILogger,
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
        type: personalWallet.walletType,
        subtype: personalWallet.walletSubType,
        ethereumAddress: personalWallet.ethereumAddress,
      }),
    );

    this.web3ConnectionWatcher.start();
  }

  private watchConnection = async () => {
    this.logger.verbose("Checking web3 status...");
    if (!this.personalWallet) {
      this.logger.error("Web3 watcher started without valid personalWallet instance!");
      return;
    }

    const isConnectionWorking = await promiseTimeout({
      promise: this.personalWallet.testConnection(this.networkId),
      defaultValue: false,
      timeout: WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    });

    if (!isConnectionWorking) {
      this.onWeb3ConnectionLost();
    }
  };

  private onWeb3ConnectionLost = () => {
    this.logger.info("Web3 connection lost");
    this.dispatch(web3Flows.personalWalletDisconnected);

    this.web3ConnectionWatcher.stop();
  };
}
