// tslint:disable-next-line: no-submodule-imports
import createHistory from "history/createBrowserHistory";
// tslint:disable-next-line: no-submodule-imports
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { logger } from "redux-logger";
import "reflect-metadata";

import "../node_modules/font-awesome/scss/font-awesome.scss";
import { App } from "./components/App";
import { getConfig } from "./getConfig";
import { customizerContainerWithMiddlewareApi, getContainer } from "./getContainer";
import muiTheme from "./muiTheme";
import { createInjectMiddleware } from "./redux-injectify";
import { IAppState, reducers } from "./store";
import "./styles/bootstrap.scss";

// @note: this is done to make HMR work with react router. In production build its gone.
function forceRerenderInDevMode(): number {
  if (process.env.NODE_ENV === "development") {
    return Math.random();
  } else {
    return 1;
  }
}

function renderApp(store: Store<IAppState>, history: any, Component: React.SFC<any>): void {
  const mountNode = document.getElementById("app");
  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Provider store={store}>
        <ConnectedRouter key={forceRerenderInDevMode()} history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>,
    mountNode,
  );
}

function startupApp(history: any): Store<IAppState> {
  const config = getConfig(process.env);
  const container = getContainer(config);
  const middleware = applyMiddleware(
    routerMiddleware(history),
    createInjectMiddleware(container, customizerContainerWithMiddlewareApi),
    logger,
  );

  const store = createStore(reducers, middleware);

  return store;
}

if (process.env.NODE_ENV === "development") {
  if ((module as any).hot) {
    (module as any).hot.accept("./components/App", () => {
      const { App } = require("./components/App");
      // tslint:disable-next-line
      renderApp(store, history, App);
    });
  }
}

const history = createHistory();
const store = startupApp(history);
renderApp(store, history, App);
