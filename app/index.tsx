// tslint:disable-next-line: no-submodule-imports
import createHistory from "history/createBrowserHistory";
import { Container } from "inversify";
// tslint:disable-next-line: no-submodule-imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import { IntlProvider } from "react-intl";
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { logger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import "reflect-metadata";

import { App } from "./components/App";
import { getConfig } from "./config/getConfig";
import {
  createGlobalDependencies,
  customizerContainerWithMiddlewareApi,
  setupBindings,
  TGlobalDependencies,
} from "./di/setupBindings";
import { createInjectMiddleware } from "./middlewares/redux-injectify";
import { rootSaga } from "./modules/sagas";
import { IAppState, reducers } from "./store";
import { InversifyProvider } from "./utils/InversifyProvider";

import * as languageEn from "../intl/locales/en-en.json";
import "../node_modules/font-awesome/scss/font-awesome.scss";
import "./styles/bootstrap.scss";
import "./styles/overrides.scss";

// @note: this is done to make HMR work with react router. In production build its gone.
function forceRerenderInDevMode(): number {
  if (process.env.NODE_ENV === "development") {
    return Math.random();
  } else {
    return 1;
  }
}

function renderApp(
  store: Store<IAppState>,
  history: any,
  container: Container,
  Component: React.ComponentClass,
): void {
  const mountNode = document.getElementById("app");
  ReactDOM.render(
    <ReduxProvider store={store}>
      <InversifyProvider container={container}>
        <ConnectedRouter key={forceRerenderInDevMode()} history={history}>
          <IntlProvider locale="en-us" messages={languageEn}>
            <Component />
          </IntlProvider>
        </ConnectedRouter>
      </InversifyProvider>
    </ReduxProvider>,
    mountNode,
  );
}

function startupApp(history: any): { store: Store<IAppState>; container: Container } {
  const config = getConfig(process.env);
  const container = setupBindings(config);

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };
  const sagaMiddleware = createSagaMiddleware({ context });

  const middleware = applyMiddleware(
    routerMiddleware(history),
    createInjectMiddleware(container, customizerContainerWithMiddlewareApi),
    logger,
    sagaMiddleware,
  );

  const store = createStore(reducers, composeWithDevTools(middleware));
  // we have to create the dependencies here, because getState and dispatch get
  // injected in the middleware step above, maybe change this later
  context.deps = createGlobalDependencies(container);
  sagaMiddleware.run(rootSaga);

  return { store, container };
}

const history = createHistory();
const { store, container } = startupApp(history);
renderApp(store, history, container, hot(module)(App));
