/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-unassigned-import
import "react-native-gesture-handler";
// eslint-disable-next-line import/no-unassigned-import
import "./polyfills";
import { IModuleStore } from "@neufund/sagas";
import { Container } from "inversify";
import React from "react";
import { AppRegistry } from "react-native";
import { enableScreens } from "react-native-screens";

import { createAppStore } from "store/create";
import { TAppGlobalState } from "store/types";

// eslint-disable-next-line import/no-relative-parent-imports
import { name as appName } from "../app.json";

// Turn's on native navigation screens support to improve perf
// see https://reactnavigation.org/docs/react-native-screens/#setup-when-you-are-using-expo
enableScreens();

function startupApp(): void {
  const container = new Container();

  const store = createAppStore(container);

  let getComponent: (
    store: IModuleStore<TAppGlobalState>,
    container: Container,
  ) => React.ComponentType;

  // there is no support for import tree-shaking in metro-bundler
  // that's why we use dynamic `require` to let me minifier remove unused code
  // see https://github.com/facebook/metro/issues/227
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    getComponent = require("./index.dev").getComponent;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    getComponent = require("./index.prod").getComponent;
  }

  const Component: React.ComponentType = getComponent(store, container);

  AppRegistry.registerComponent(appName, () => Component);
}

export { startupApp };
