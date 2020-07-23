// eslint-disable-next-line import/no-unassigned-import
import "./devUtils";

import { IModuleStore } from "@neufund/sagas";
import { Container } from "inversify";
import React from "react";
import Config from "react-native-config";
import DevMenu from "react-native-dev-menu";

import { AppContainer } from "components/containers/AppContainer";

import { TAppGlobalState } from "store/types";

// eslint-disable-next-line import/no-relative-parent-imports
import { Storybook } from "../storybook";
import { App } from "./App";

function getComponent(
  store: IModuleStore<TAppGlobalState>,
  container: Container,
): React.ComponentType {
  return () => {
    const [isStorybookUI, setStorybookUI] = React.useState(Config.STORYBOOK_RUN === "1");

    React.useEffect(() => {
      DevMenu.addItem("Toggle Storybook", () => setStorybookUI(isStUI => !isStUI));
    }, []);

    if (isStorybookUI) {
      return <Storybook />;
    }

    return (
      <AppContainer store={store} container={container}>
        <App />
      </AppContainer>
    );
  };
}

export { getComponent };
