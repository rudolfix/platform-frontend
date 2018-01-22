import { ReactWrapper } from "enzyme";
import { Container } from "inversify";
import { applyMiddleware, createStore, Store } from "redux";
import { customizerContainerWithMiddlewareApi, getContainer } from "../app/getContainer";
import { LedgerConnectorSymbol, LedgerWallet } from "../app/modules/web3/LedgerWallet";
import { Web3Manager, Web3ManagerSymbol } from "../app/modules/web3/Web3Manager";
import { createInjectMiddleware } from "../app/redux-injectify";
import { IAppState, reducers } from "../app/store";
import { dummyConfig } from "./fixtures";
import { createMock, tid } from "./testUtils";

interface ICreateIntegrationTestsSetupOptions {
  initialState?: Partial<IAppState>;
  ledgerWalletMock?: LedgerWallet;
  web3Manager?: Web3Manager;
}

interface ICreateIntegrationTestsSetupOutput {
  store: Store<IAppState>;
  container: Container;
}

export function createIntegrationTestsSetup(
  options: ICreateIntegrationTestsSetupOptions,
): ICreateIntegrationTestsSetupOutput {
  const ledgerWalletMock = options.ledgerWalletMock || createMock(LedgerWallet, {});
  const web3Manager = options.web3Manager || createMock(Web3Manager, {});
  const container = getContainer(dummyConfig);
  container.rebind(LedgerConnectorSymbol).toConstantValue(ledgerWalletMock);
  container.rebind(Web3ManagerSymbol).toConstantValue(web3Manager);

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
  let waitTime = 20;
  while (--waitTime > 0 && component.find(tid(id)).length === 0) {
    await Promise.resolve();
    component.update();
  }

  if (waitTime === 0) {
    throw new Error(`Timeout while waiting for '${id}'`);
  }
}
