import "react-native-gesture-handler";
import "./app/polyfills";

if (__DEV__) {
  import("./app/devUtils");
}

import { Container } from "inversify";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { AppRegistry } from "react-native";
import { IModuleStore } from "@neufund/sagas";
import Config from "react-native-config";

import { App } from "./app/App";
import { name as appName } from "./app.json";
import { AppContainer } from "./app/components/containers/AppContainer";
import { createAppStore } from "./app/store/create";
import { TAppGlobalState } from "./app/store/types";
import { StorybookUIRoot } from "./storybook";

function startupStorybookApp(): void {
  AppRegistry.registerComponent(appName, () => StorybookUIRoot);
}

function startupApp(): void {
  const container = new Container();

  const store = createAppStore(container);

  renderApp(store);
}

function renderApp(store: IModuleStore<TAppGlobalState>): void {
  const Component = () => (
    <ReduxProvider store={store}>
      <AppContainer>
        <App />
      </AppContainer>
    </ReduxProvider>
  );

  AppRegistry.registerComponent(appName, () => Component);
}

if (Config.STORYBOOK_RUN === "1") {
  startupStorybookApp();
} else {
  startupApp();
}
