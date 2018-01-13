import "./styles/bootstrap.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Store, applyMiddleware } from "redux";

import { App } from "./components/App";
import { reducers, IAppState } from "./store";
import { Provider } from "react-redux";
import { logger } from "redux-logger";

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
  const middleware = applyMiddleware(logger);

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
