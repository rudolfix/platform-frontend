import { ReactWrapper } from "enzyme";
import { Container } from "inversify";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";

import { MemoryRouter } from "react-router";
import { customizerContainerWithMiddlewareApi, getContainer } from "../app/getContainer";
import {
  BROWSER_WALLET_CONNECTOR_SYMBOL,
  BrowserWalletConnector,
} from "../app/modules/web3/BrowserWallet";
import {
  LEDGER_WALLET_CONNECTOR_SYMBOL,
  LedgerWalletConnector,
} from "../app/modules/web3/LedgerWallet";
import { WEB3_MANAGER_SYMBOL, Web3Manager } from "../app/modules/web3/Web3Manager";
import { createInjectMiddleware } from "../app/redux-injectify";
import { IAppState, reducers } from "../app/store";
import { InversifyProvider } from "../app/utils/InversifyProvider";
import { LOGGER_SYMBOL } from "../app/utils/Logger";
import { dummyConfig, dummyLogger } from "./fixtures";
import { createMock, tid } from "./testUtils";

interface ICreateIntegrationTestsSetupOptions {
  initialState?: Partial<IAppState>;
  browserWalletConnectorMock?: BrowserWalletConnector;
  ledgerWalletConnectorMock?: LedgerWalletConnector;
  web3ManagerMock?: Web3Manager;
}

interface ICreateIntegrationTestsSetupOutput {
  store: Store<IAppState>;
  container: Container;
}

export function createIntegrationTestsSetup(
  options: ICreateIntegrationTestsSetupOptions = {},
): ICreateIntegrationTestsSetupOutput {
  const browserWalletMock =
    options.browserWalletConnectorMock || createMock(BrowserWalletConnector, {});
  const ledgerWalletMock =
    options.ledgerWalletConnectorMock || createMock(LedgerWalletConnector, {});
  const web3ManagerMock = options.web3ManagerMock || createMock(Web3Manager, {});
  const container = getContainer(dummyConfig);
  container.rebind(LEDGER_WALLET_CONNECTOR_SYMBOL).toConstantValue(ledgerWalletMock);
  container.rebind(BROWSER_WALLET_CONNECTOR_SYMBOL).toConstantValue(browserWalletMock);
  container.rebind(WEB3_MANAGER_SYMBOL).toConstantValue(web3ManagerMock);
  container.rebind(LOGGER_SYMBOL).toConstantValue(dummyLogger);

  const middleware = applyMiddleware(
    createInjectMiddleware(container, (container, middlewareApi) => {
      customizerContainerWithMiddlewareApi(container, middlewareApi);
    }),
  );
  const store = createStore(reducers, options.initialState as any, middleware);

  return {
    store,
    container,
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

interface ICreateProviderContext {
  container?: Container;
  currentRoute?: string;
  store?: Store<any>;
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

  const { currentRoute = "/", store = setup!.store, container = setup!.container } = context;

  return (
    <MemoryRouter initialEntries={[currentRoute]}>
      <ReduxProvider store={store}>
        <InversifyProvider container={container}>
          <Component />
        </InversifyProvider>
      </ReduxProvider>
    </MemoryRouter>
  );
}
