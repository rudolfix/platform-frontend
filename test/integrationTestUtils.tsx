import { ReactWrapper } from "enzyme";
import { Container } from "inversify";
import * as React from "react";
import { IntlProvider } from "react-intl";
import { Provider as ReduxProvider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import { SinonSpy } from "sinon";

import { ConnectedRouter } from "react-router-redux";
import {
  customizerContainerWithMiddlewareApi,
  setupBindings,
  TGlobalDependencies,
  createGlobalDependencies,
} from "../app/di/setupBindings";
import { symbols } from "../app/di/symbols";
import { BrowserWalletConnector } from "../app/lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../app/lib/web3/LedgerWallet";
import { Web3Manager } from "../app/lib/web3/Web3Manager";
import { createInjectMiddleware } from "../app/middlewares/redux-injectify";
import { IAppState, reducers } from "../app/store";
import { InversifyProvider } from "../app/utils/InversifyProvider";
import { dummyConfig, dummyLogger } from "./fixtures";
import { createMock, tid } from "./testUtils";
import { Storage } from "../app/lib/persistence/Storage";
import { ObjectStorage } from "../app/lib/persistence/ObjectStorage";
import {
  TWalletMetadata,
  STORAGE_WALLET_METADATA_KEY,
} from "../app/lib/persistence/WalletMetadataObjectStorage";
import { STORAGE_JWT_KEY } from "../app/lib/persistence/JwtObjectStorage";
import { createMockStorage } from "../app/lib/persistence/Storage.mock";
import { rootSaga } from "../app/modules/sagas";
import { Web3ManagerMock } from "../app/lib/web3/Web3Manager.mock";
import { Web3Adapter } from "../app/lib/web3/Web3Adapter";
import { UsersApi } from "../app/lib/api/users/UsersApi";
import { SignatureAuthApi } from "../app/lib/api/SignatureAuthApi";
import { createSpyMiddleware } from "./reduxSpyMiddleware";
import { routerMiddleware } from "react-router-redux";
import { BrowserRouter } from "react-router-dom";
import { createBrowserHistory, History, createMemoryHistory } from "history";

const defaultTranslations = require("../intl/locales/en-en.json");

interface ICreateIntegrationTestsSetupOptions {
  initialState?: Partial<IAppState>;
  browserWalletConnectorMock?: BrowserWalletConnector;
  ledgerWalletConnectorMock?: LedgerWalletConnector;
  storageMock?: Storage;
  usersApiMock?: UsersApi;
  signatureAuthApiMock?: SignatureAuthApi;
  initialRoute?: string;
}

interface ICreateIntegrationTestsSetupOutput {
  store: Store<IAppState>;
  container: Container;
  dispatchSpy: SinonSpy;
  history: History;
}

export function createIntegrationTestsSetup(
  options: ICreateIntegrationTestsSetupOptions = {},
): ICreateIntegrationTestsSetupOutput {
  const browserWalletMock =
    options.browserWalletConnectorMock || createMock(BrowserWalletConnector, {});
  const ledgerWalletMock =
    options.ledgerWalletConnectorMock || createMock(LedgerWalletConnector, {});
  const storageMock = options.storageMock || createMockStorage();
  const usersApiMock = options.usersApiMock || createMock(UsersApi, {});
  const signatureAuthApiMock = options.signatureAuthApiMock || createMock(SignatureAuthApi, {});

  const container = setupBindings(dummyConfig);
  container.rebind(symbols.ledgerWalletConnector).toConstantValue(ledgerWalletMock);
  container.rebind(symbols.browserWalletConnector).toConstantValue(browserWalletMock);
  container
    .rebind(symbols.web3Manager)
    .to(Web3ManagerMock)
    .inSingletonScope();
  container.rebind(symbols.logger).toConstantValue(dummyLogger);
  container.rebind(symbols.storage).toConstantValue(storageMock);
  container.rebind(symbols.usersApi).toConstantValue(usersApiMock);
  container.rebind(symbols.signatureAuthApi).toConstantValue(signatureAuthApiMock);

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };

  const sagaMiddleware = createSagaMiddleware({ context });
  const spyMiddleware = createSpyMiddleware();

  const history = createMemoryHistory({
    initialEntries: [options.initialRoute ? options.initialRoute : "/"],
  });

  const middleware = applyMiddleware(
    spyMiddleware.middleware,
    routerMiddleware(history),
    createInjectMiddleware(container, (container, middlewareApi) => {
      customizerContainerWithMiddlewareApi(container, middlewareApi);
    }),
    sagaMiddleware,
  );

  const store = createStore(reducers, options.initialState as any, middleware);
  context.deps = createGlobalDependencies(container);
  sagaMiddleware.run(rootSaga);

  return {
    store,
    container,
    dispatchSpy: spyMiddleware.dispatchSpy,
    history,
  };
}

export function clickFirstTid(component: ReactWrapper, id: string): void {
  component
    .find(tid(id))
    .first()
    .simulate("click");
}

export async function waitForTid(component: ReactWrapper, id: string): Promise<void> {
  // wait until event queue is empty :/ currently we don't have a better way to solve it
  let waitTime = 20;
  while (--waitTime > 0 && component.find(tid(id)).length === 0) {
    await Promise.resolve();
    component.update();
  }

  if (waitTime === 0) {
    throw new Error(`Timeout while waiting for '${id}'`);
  }
}
export async function waitForPredicate(predicate: () => boolean, errorMsg: string): Promise<void> {
  // wait until event queue is empty :/ currently we don't have a better way to solve it
  let waitTime = 20;
  while (--waitTime > 0 && !predicate()) {
    await Promise.resolve();
  }

  if (waitTime === 0) {
    throw new Error(`Timeout while waiting for '${errorMsg}'`);
  }
}

interface ICreateProviderContext {
  container?: Container;
  store?: Store<any>;
  history?: History;
}

export function wrapWithProviders(
  Component: React.ComponentType,
  context: ICreateProviderContext = {},
): React.ReactElement<any> {
  // avoid creating store and container if they were provided
  let setup: ICreateIntegrationTestsSetupOutput | null = null;
  if (!context.store || !context.container) {
    setup = createIntegrationTestsSetup();
  }

  const {
    store = setup!.store,
    container = setup!.container,
    history = createMemoryHistory(),
  } = context;

  return (
    <ReduxProvider store={store}>
      <ConnectedRouter history={history!}>
        <InversifyProvider container={container}>
          {/* if we experience slow dows related to this we can switch to injecting dummy intl impl*/}
          <IntlProvider locale="en-en" messages={defaultTranslations}>
            <Component />
          </IntlProvider>
        </InversifyProvider>
      </ConnectedRouter>
    </ReduxProvider>
  );
}

export function wrapWithIntl(component: React.ReactElement<any>): React.ReactElement<any> {
  return (
    <IntlProvider locale="en-en" messages={defaultTranslations}>
      {component}
    </IntlProvider>
  );
}
