export const DispatchSymbol = "Dispatch";
export const NavigateToSymbol = "NavigateTo";
export const DelaySymbol = "Delay";
export const GetStateSymbol = "GetState";

import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "./getConfig";
import { IHttpClient } from "./modules/networking/IHttpClient";
import { JsonHttpClient, JsonHttpClientSymbol } from "./modules/networking/JsonHttpClient";
import { SignatureAuthApi, SignatureAuthApiSymbol } from "./modules/networking/SignatureAuthApi";
import { UsersApi, UsersApiSymbol } from "./modules/networking/UsersApi";
import { VaultApi, VaultApiSymbol } from "./modules/networking/VaultApi";
import {
  NotificationCenter,
  NotificationCenterSymbol,
} from "./modules/notifications/NotificationCenter";
import { Storage, StorageSymbol } from "./modules/storage/storage";
import { BrowserWalletConnector, BrowserWalletConnectorSymbol } from "./modules/web3/BrowserWallet";
import { LedgerWalletConnector, LedgerWalletConnectorSymbol } from "./modules/web3/LedgerWallet";
import {
  LightWalletConnector,
  LightWalletConnectorSymbol,
  LightWalletUtil,
  LightWalletUtilSymbol,
} from "./modules/web3/LightWallet";
import {
  IEthereumNetworkConfig,
  IEthereumNetworkConfigSymbol,
  Web3Manager,
  Web3ManagerSymbol,
} from "./modules/web3/Web3Manager";
import { IAppState } from "./store";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactorySymbol,
  AsyncIntervalSchedulerFactoryType,
} from "./utils/AsyncIntervalScheduler";
import {
  cryptoRandomString,
  CryptoRandomString,
  CryptoRandomStringSymbol,
} from "./utils/cryptoRandomString";
import { DevConsoleLogger, ILogger, LoggerSymbol } from "./utils/Logger";

export type Delay = (n: number) => Promise<void>;
export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export function getContainer(config: IConfig): Container {
  const container = new Container();
  const storage = new Storage(window.localStorage);
  const lightWalletUtil = new LightWalletUtil();

  // functions
  const delay = (time: number) => new Promise<void>(resolve => setTimeout(resolve, time));
  container.bind<CryptoRandomString>(CryptoRandomStringSymbol).toConstantValue(cryptoRandomString);
  container.bind<Delay>("Delay").toConstantValue(delay);
  container
    .bind<IEthereumNetworkConfig>(IEthereumNetworkConfigSymbol)
    .toConstantValue(config.ethereumNetwork);

  // @todo different logger could be injected to each class with additional info like name of the file etc.
  container.bind<ILogger>(LoggerSymbol).toConstantValue(new DevConsoleLogger());

  // classes
  container.bind<IHttpClient>(JsonHttpClientSymbol).to(JsonHttpClient);
  // singletons
  container
    .bind<SignatureAuthApi>(SignatureAuthApiSymbol)
    .to(SignatureAuthApi)
    .inSingletonScope();

  container.bind<LightWalletUtil>(LightWalletUtilSymbol).toConstantValue(lightWalletUtil);

  container
    .bind<VaultApi>(VaultApiSymbol)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(UsersApiSymbol)
    .to(UsersApi)
    .inSingletonScope();

  container.bind<Storage>(StorageSymbol).toConstantValue(storage);
  container
    .bind<NotificationCenter>(NotificationCenterSymbol)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<LedgerWalletConnector>(LedgerWalletConnectorSymbol)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(LightWalletConnectorSymbol)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(BrowserWalletConnectorSymbol)
    .to(BrowserWalletConnector)
    .inSingletonScope();
  container
    .bind<Web3Manager>(Web3ManagerSymbol)
    .to(Web3Manager)
    .inSingletonScope();

  // factories
  container
    .bind<AsyncIntervalSchedulerFactoryType>(AsyncIntervalSchedulerFactorySymbol)
    .toFactory(AsyncIntervalSchedulerFactory);

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(DispatchSymbol).toConstantValue(dispatch);
  container.bind(GetStateSymbol).toConstantValue(() => getState());
  container.bind(NavigateToSymbol).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
