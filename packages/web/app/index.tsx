import "./polyfills.sideEffect";

// tslint:disable-next-line:ordered-imports
import "./components/translatedMessages/yupLocales.sideEffect";

import "./index.scss";

import { createStore, getSagaExtension } from "@neufund/sagas";
import { InversifyProvider } from "@neufund/shared";
import { getContextToDepsExtension, getLoadContextExtension } from "@neufund/shared-modules";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory, History } from "history";
import { Container } from "inversify";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { initializePhraseAppEditor } from "react-intl-phraseapp";
import { Provider as ReduxProvider } from "react-redux";
import { Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { App } from "./components/App";
import { getConfig, IConfig } from "./config/getConfig";
import { createGlobalDependencies, TGlobalDependencies } from "./di/setupBindings";
import { reduxLogoutReset } from "./middlewares/redux-logout-reset";
import { setupAppModule, staticValues, TAppGlobalState } from "./store";
import * as ga from "./utils/googleAnalitycs.js";
import { IntlProviderAndInjector } from "./utils/IntlProviderAndInjector";
import * as serviceWorker from "./utils/serviceWorker.unsafe";

export const createAppStore = (history: History, config: IConfig, container: Container) => {
  const appModule = setupAppModule({ history, config, container });

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };

  return createStore<TAppGlobalState>(
    {
      extensions: [
        getLoadContextExtension(context.container),
        getContextToDepsExtension(
          appModule[appModule.length - 1],
          createGlobalDependencies,
          context,
        ),
        getSagaExtension(context),
      ],
      enhancers: [reduxLogoutReset(staticValues)],
      advancedComposeEnhancers: composeWithDevTools({
        trace: true, //use the new redux-dev-tools trace feature
        traceLimit: 25,
        actionsBlacklist: (process.env.REDUX_DEVTOOLS_ACTION_BLACK_LIST || "").split(","),
      }),
    },
    ...appModule,
  );
};

function renderApp(
  store: Store<TAppGlobalState>,
  history: History,
  container: Container,
  Component: React.ComponentType,
): void {
  const mountNode = document.getElementById("app");

  ReactDOM.render(
    <ReduxProvider store={store}>
      <InversifyProvider container={container}>
        <IntlProviderAndInjector>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </IntlProviderAndInjector>
      </InversifyProvider>
    </ReduxProvider>,
    mountNode,
  );
}

function startupApp(history: History): { store: Store<TAppGlobalState>; container: Container } {
  const config = getConfig(process.env);

  const container = new Container();

  const store = createAppStore(history, config, container);

  return { store, container };
}

if (process.env.NF_ENABLE_TRANSLATE_OVERLAY) {
  const config = {
    projectId: process.env.NF_TRANSLATION_ID!,
    phraseEnabled: true,
    prefix: "[[__",
    suffix: "__]]",
  };
  initializePhraseAppEditor(config);
}

ga.installGA();
/* tslint:disable-next-line:no-floating-promises */
serviceWorker.unregister(); //todo remove this

const history = createBrowserHistory();
const { store, container } = startupApp(history);
renderApp(store, history, container, App);
