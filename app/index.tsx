import "reflect-metadata";

// tslint:disable-next-line: no-submodule-imports
import createHistory from "history/createBrowserHistory";
// tslint:disable-next-line: no-submodule-imports
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import { Provider as ReduxProvider } from "react-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { logger } from "redux-logger";

import { App } from "./components/App";
import { getConfig } from "./getConfig";
import { customizerContainerWithMiddlewareApi, getContainer } from "./getContainer";
import muiTheme from "./muiTheme";
import { createInjectMiddleware } from "./redux-injectify";
import { IAppState, reducers } from "./store";

import { Container } from "inversify";
import "../node_modules/font-awesome/scss/font-awesome.scss";
import "./styles/bootstrap.scss";
import { InversifyProvider } from "./utils/InversifyProvider";

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
    <MuiThemeProvider muiTheme={muiTheme}>
      <ReduxProvider store={store}>
        <InversifyProvider container={container}>
          <ConnectedRouter key={forceRerenderInDevMode()} history={history}>
            <Component />
          </ConnectedRouter>
        </InversifyProvider>
      </ReduxProvider>
    </MuiThemeProvider>,
    mountNode,
  );
}

function startupApp(history: any): { store: Store<IAppState>; container: Container } {
  const config = getConfig(process.env);
  const container = getContainer(config);
  const middleware = applyMiddleware(
    routerMiddleware(history),
    createInjectMiddleware(container, customizerContainerWithMiddlewareApi),
    logger,
  );

  const store = createStore(reducers, middleware);

  return { store, container };
}

const history = createHistory();
const { store, container } = startupApp(history);
renderApp(store, history, container, hot(module)(App));
