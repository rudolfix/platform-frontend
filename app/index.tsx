import "reflect-metadata";
import "./styles/bootstrap.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Store, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { logger } from "redux-logger";

import { App } from "./components/App";
import { createInjectMiddleware } from "./redux-injectify";
import { reducers, IAppState } from "./store";
import { getContainer } from "./getContainer";

function renderApp(store: Store<IAppState>, Component: React.SFC<any>): void {
  const mountNode = document.getElementById("app");
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    mountNode,
  );
}

function startupApp(): Store<IAppState> {
  const container = getContainer();
  const middleware = applyMiddleware(createInjectMiddleware(container), logger);

  const store = createStore(reducers, middleware);

  return store;
}

if (process.env.NODE_ENV === "development") {
  if ((module as any).hot) {
    (module as any).hot.accept("./components/App", () => {
      const { App } = require("./components/App");
      // tslint:disable-next-line
      renderApp(store, App);
    });
  }
}

const store = startupApp();
renderApp(store, App);
