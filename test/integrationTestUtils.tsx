import { ReactWrapper } from "enzyme";
import { Container } from "inversify";
import * as React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";
// tslint:disable-next-line
import { MuiThemeProvider } from "material-ui/styles";

import { MemoryRouter } from "react-router";
import { customizerContainerWithMiddlewareApi, getContainer } from "../app/getContainer";
import { BrowserWallet, BrowserWalletSymbol } from "../app/modules/web3/BrowserWallet";
import { LedgerConnectorSymbol, LedgerWallet } from "../app/modules/web3/LedgerWallet";
import { Web3Manager, Web3ManagerSymbol } from "../app/modules/web3/Web3Manager";
import { createInjectMiddleware } from "../app/redux-injectify";
import { IAppState, reducers } from "../app/store";
import { InversifyProvider } from "../app/utils/InversifyProvider";
import { LoggerSymbol } from "../app/utils/Logger";
import { dummyConfig, dummyLogger } from "./fixtures";
import { createMock, tid } from "./testUtils";

interface ICreateIntegrationTestsSetupOptions {
  initialState?: Partial<IAppState>;
  browserWalletMock?: BrowserWallet;
  ledgerWalletMock?: LedgerWallet;
  web3ManagerMock?: Web3Manager;
}

interface ICreateIntegrationTestsSetupOutput {
  store: Store<IAppState>;
  container: Container;
}

export function createIntegrationTestsSetup(
  options: ICreateIntegrationTestsSetupOptions = {},
): ICreateIntegrationTestsSetupOutput {
  const browserWalletMock = options.browserWalletMock || createMock(BrowserWallet, {});
  const ledgerWalletMock = options.ledgerWalletMock || createMock(LedgerWallet, {});
  const web3ManagerMock = options.web3ManagerMock || createMock(Web3Manager, {});
  const container = getContainer(dummyConfig);
  container.rebind(LedgerConnectorSymbol).toConstantValue(ledgerWalletMock);
  container.rebind(BrowserWalletSymbol).toConstantValue(browserWalletMock);
  container.rebind(Web3ManagerSymbol).toConstantValue(web3ManagerMock);
  container.rebind(LoggerSymbol).toConstantValue(dummyLogger);

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

export function createProviders(
  Component: React.ComponentType,
  context: ICreateProviderContext = {},
): React.ReactElement<any> {
  // avoid creating store and contianer if they were provided
  let setup: ICreateIntegrationTestsSetupOutput | null = null;
  if (!context.store || !context.container) {
    setup = createIntegrationTestsSetup();
  }

  const { currentRoute = "/", store = setup!.store, container = setup!.container } = context;

  return (
    <MuiThemeProvider>
      <MemoryRouter initialEntries={[currentRoute]}>
        <ReduxProvider store={store}>
          <InversifyProvider container={container}>
            <Component />
          </InversifyProvider>
        </ReduxProvider>
      </MemoryRouter>
    </MuiThemeProvider>
  );
}
