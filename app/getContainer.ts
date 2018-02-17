import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "./getConfig";
import { IHttpClient } from "./modules/networking/IHttpClient";
import { JsonHttpClient } from "./modules/networking/JsonHttpClient";
import { SignatureAuthApi } from "./modules/networking/SignatureAuthApi";
import { UsersApi } from "./modules/networking/UsersApi";
import { VaultApi } from "./modules/networking/VaultApi";
import { NotificationCenter } from "./modules/notifications/NotificationCenter";
import { Storage } from "./modules/storage/storage";
import { BrowserWalletConnector } from "./modules/web3/BrowserWallet";
import { LedgerWalletConnector } from "./modules/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "./modules/web3/LightWallet";
import { IEthereumNetworkConfig, Web3Manager } from "./modules/web3/Web3Manager";
import { IAppState } from "./store";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactoryType,
} from "./utils/AsyncIntervalScheduler";
import { cryptoRandomString, CryptoRandomString } from "./utils/cryptoRandomString";
import { DevConsoleLogger, ILogger } from "./utils/Logger";

import { ApiKycService } from "./lib/api/kyc";
import { symbols } from "./symbols";

export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export function getContainer(config: IConfig): Container {
  const container = new Container();
  const storage = new Storage(window.localStorage);
  const lightWalletUtil = new LightWalletUtil();

  // functions
  container
    .bind<CryptoRandomString>(symbols.cryptoRandomString)
    .toConstantValue(cryptoRandomString);
  container
    .bind<IEthereumNetworkConfig>(symbols.ethereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);

  // @todo different logger could be injected to each class with additional info like name of the file etc.
  container.bind<ILogger>(symbols.logger).toConstantValue(new DevConsoleLogger());

  // classes
  container.bind<IHttpClient>(symbols.jsonHttpClient).to(JsonHttpClient);
  // singletons
  container
    .bind<SignatureAuthApi>(symbols.signatureAuthApi)
    .to(SignatureAuthApi)
    .inSingletonScope();

  container.bind<LightWalletUtil>(symbols.lightWalletUtil).toConstantValue(lightWalletUtil);

  container
    .bind<VaultApi>(symbols.vaultApi)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(symbols.usersApi)
    .to(UsersApi)
    .inSingletonScope();

  container.bind<Storage>(symbols.storage).toConstantValue(storage);
  container
    .bind<NotificationCenter>(symbols.notificationCenter)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<LedgerWalletConnector>(symbols.ledgerWalletConnector)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(symbols.lightWalletConnector)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(symbols.browserWalletConnector)
    .to(BrowserWalletConnector)
    .inSingletonScope();
  container
    .bind<Web3Manager>(symbols.web3Manager)
    .to(Web3Manager)
    .inSingletonScope();
  container
    .bind<ApiKycService>(symbols.apiKycService)
    .to(ApiKycService)
    .inSingletonScope();

  // factories
  container
    .bind<AsyncIntervalSchedulerFactoryType>(symbols.asyncIntervalSchedulerFactory)
    .toFactory(AsyncIntervalSchedulerFactory);

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(symbols.appDispatch).toConstantValue(dispatch);
  container.bind(symbols.getState).toConstantValue(() => getState());
  container.bind(symbols.navigateTo).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
