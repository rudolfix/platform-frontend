import "react-native-gesture-handler";
import "./polyfills";

import { IModuleStore } from "@neufund/sagas";
import { Container } from "inversify";
import React from "react";
import { AppRegistry } from "react-native";
import Config from "react-native-config";
import DevMenu from "react-native-dev-menu";

// eslint-disable-next-line import/no-relative-parent-imports
import { name as appName } from "../app.json";
// eslint-disable-next-line import/no-relative-parent-imports
import { Storybook } from "../storybook";
import { App } from "./App";
import { AppContainer } from "./components/containers/AppContainer";
import { createAppStore } from "./store/create";
import { TAppGlobalState } from "./store/types";

if (__DEV__) {
  import("./devUtils");
}

function startupApp(): void {
  const container = new Container();

  const store = createAppStore(container);

  renderApp(store);
}

function renderApp(store: IModuleStore<TAppGlobalState>): void {
  const Component = () => {
    const [isStorybookUI, setStorybookUI] = React.useState(Config.STORYBOOK_RUN === "1");

    React.useEffect(() => {
      // If it's a storybook mode do not allow toggling
      if (__DEV__ && Config.STORYBOOK_RUN !== "1") {
        DevMenu.addItem("Toggle Storybook", () => setStorybookUI(isStUI => !isStUI));
      }
    }, []);

    if (isStorybookUI) {
      return <Storybook />;
    }

    return (
      <AppContainer store={store}>
        <App />
      </AppContainer>
    );
  };

  AppRegistry.registerComponent(appName, () => Component);
}

export { startupApp };
