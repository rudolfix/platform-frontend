export const APP_DISPATCH_SYMBOL = Symbol();
export const NAVIGATE_TO_SYMBOL = Symbol();
export const GET_STATE_SYMBOL = Symbol();

import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "./getConfig";
import { IHttpClient } from "./modules/networking/IHttpClient";
import { JSON_HTTP_CLIENT_SYMBOL, JsonHttpClient } from "./modules/networking/JsonHttpClient";
import { SIGNATURE_AUTH_API_SYMBOL, SignatureAuthApi } from "./modules/networking/SignatureAuthApi";
import { USERS_API_SYMBOL, UsersApi } from "./modules/networking/UsersApi";
import { VAULT_API_SYMBOL, VaultApi } from "./modules/networking/VaultApi";
import {
  NOTIFICATION_CENTER_SYMBOL,
  NotificationCenter,
} from "./modules/notifications/NotificationCenter";
import { Storage, STORAGE_SYMBOL } from "./modules/storage/storage";
import {
  BROWSER_WALLET_CONNECTOR_SYMBOL,
  BrowserWalletConnector,
} from "./modules/web3/BrowserWallet";
import { LEDGER_WALLET_CONNECTOR_SYMBOL, LedgerWalletConnector } from "./modules/web3/LedgerWallet";
import {
  LIGHT_WALLET_CONNECTOR_SYMBOL,
  LIGHT_WALLET_UTIL_SYMBOL,
  LightWalletConnector,
  LightWalletUtil,
} from "./modules/web3/LightWallet";
import {
  ETHEREUM_NETWORK_CONFIG_SYMBOL,
  IEthereumNetworkConfig,
  WEB3_MANAGER_SYMBOL,
  Web3Manager,
} from "./modules/web3/Web3Manager";
import { IAppState } from "./store";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactorySymbol,
  AsyncIntervalSchedulerFactoryType,
} from "./utils/AsyncIntervalScheduler";
import {
  CRYPTO_RANDOM_STRING_SYMBOL,
  cryptoRandomString,
  CryptoRandomString,
} from "./utils/cryptoRandomString";
import { DevConsoleLogger, ILogger, LOGGER_SYMBOL } from "./utils/Logger";

import { API_KYC_SERVICE_SYMBOL } from "./lib";

import { ApiKycService } from "./lib/api/kyc";

export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export function getContainer(config: IConfig): Container {
  const container = new Container();
  const storage = new Storage(window.localStorage);
  const lightWalletUtil = new LightWalletUtil();

  // functions
  container
    .bind<CryptoRandomString>(CRYPTO_RANDOM_STRING_SYMBOL)
    .toConstantValue(cryptoRandomString);
  container
    .bind<IEthereumNetworkConfig>(ETHEREUM_NETWORK_CONFIG_SYMBOL)
    .toConstantValue(config.ethereumNetwork);

  // @todo different logger could be injected to each class with additional info like name of the file etc.
  container.bind<ILogger>(LOGGER_SYMBOL).toConstantValue(new DevConsoleLogger());

  // classes
  container.bind<IHttpClient>(JSON_HTTP_CLIENT_SYMBOL).to(JsonHttpClient);
  // singletons
  container
    .bind<SignatureAuthApi>(SIGNATURE_AUTH_API_SYMBOL)
    .to(SignatureAuthApi)
    .inSingletonScope();

  container.bind<LightWalletUtil>(LIGHT_WALLET_UTIL_SYMBOL).toConstantValue(lightWalletUtil);

  container
    .bind<VaultApi>(VAULT_API_SYMBOL)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(USERS_API_SYMBOL)
    .to(UsersApi)
    .inSingletonScope();

  container.bind<Storage>(STORAGE_SYMBOL).toConstantValue(storage);
  container
    .bind<NotificationCenter>(NOTIFICATION_CENTER_SYMBOL)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<LedgerWalletConnector>(LEDGER_WALLET_CONNECTOR_SYMBOL)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(LIGHT_WALLET_CONNECTOR_SYMBOL)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(BROWSER_WALLET_CONNECTOR_SYMBOL)
    .to(BrowserWalletConnector)
    .inSingletonScope();
  container
    .bind<Web3Manager>(WEB3_MANAGER_SYMBOL)
    .to(Web3Manager)
    .inSingletonScope();
  container
    .bind<ApiKycService>(API_KYC_SERVICE_SYMBOL)
    .to(ApiKycService)
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
  container.bind(APP_DISPATCH_SYMBOL).toConstantValue(dispatch);
  container.bind(GET_STATE_SYMBOL).toConstantValue(() => getState());
  container.bind(NAVIGATE_TO_SYMBOL).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
