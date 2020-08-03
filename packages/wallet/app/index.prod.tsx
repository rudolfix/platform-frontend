import { IModuleStore } from "@neufund/sagas";
import { Container } from "inversify";
import React from "react";

// eslint-disable-next-line import/no-relative-parent-imports
import { AppContainer } from "components/containers/AppContainer";

import { TAppGlobalState } from "store/types";

import { App } from "./App";

function getComponent(
  store: IModuleStore<TAppGlobalState>,
  container: Container,
): React.ComponentType {
  return () => (
    <AppContainer store={store} container={container}>
      <App />
    </AppContainer>
  );
}

export { getComponent };
