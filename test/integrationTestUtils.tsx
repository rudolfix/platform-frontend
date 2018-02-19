import { ReactWrapper } from "enzyme";
import { Container } from "inversify";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";

import { MemoryRouter } from "react-router";
import { customizerContainerWithMiddlewareApi, setupBindings } from "../app/di/setupBindings";
import { symbols } from "../app/di/symbols";
import { BrowserWalletConnector } from "../app/lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../app/lib/web3/LedgerWallet";
import { Web3Manager } from "../app/lib/web3/Web3Manager";
import { createInjectMiddleware } from "../app/middlewares/redux-injectify";
import { IAppState, reducers } from "../app/store";
import { InversifyProvider } from "../app/utils/InversifyProvider";
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
  const container = setupBindings(dummyConfig);
  container.rebind(symbols.ledgerWalletConnector).toConstantValue(ledgerWalletMock);
  container.rebind(symbols.browserWalletConnector).toConstantValue(browserWalletMock);
  container.rebind(symbols.web3Manager).toConstantValue(web3ManagerMock);
  container.rebind(symbols.logger).toConstantValue(dummyLogger);

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
