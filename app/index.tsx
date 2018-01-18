import "reflect-metadata";
import "./styles/bootstrap.scss";

// tslint:disable-next-line
import createHistory from "history/createBrowserHistory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter, routerMiddleware } from "react-router-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { logger } from "redux-logger";

import "../node_modules/font-awesome/scss/font-awesome.scss";
import { App } from "./components/App";
import { customizerContainerWithMiddlewareApi, getContainer } from "./getContainer";
import { createInjectMiddleware } from "./redux-injectify";
import { IAppState, reducers } from "./store";

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
    <Provider store={store}>
      <ConnectedRouter key={forceRerenderInDevMode()} history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    mountNode,
  );
}

function startupApp(history: any): Store<IAppState> {
  const container = getContainer();
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
