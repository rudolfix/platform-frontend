import { createStore, getSagaExtension } from "@neufund/sagas";
import {
  getContextToDepsExtension,
  getLoadContextExtension,
  INeuModule,
  setupCoreModule,
} from "@neufund/shared-modules";
import { Container } from "inversify";
import Config from "react-native-config";

import { createGlobalDependencies, TGlobalDependencies } from "../di/setupBindings";
import { appReducers } from "../modules/reducers";
import { rootSaga } from "../modules/sagas";
import { TAppGlobalState } from "./types";

export const createAppStore = (container: Container) => {
  const appModule: INeuModule<TAppGlobalState> = {
    id: "app",
    reducerMap: appReducers,
    sagas: [rootSaga],
  };

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };

  return createStore(
    {
      extensions: [
        getLoadContextExtension(context.container),
        getContextToDepsExtension(appModule, createGlobalDependencies, context),
        getSagaExtension(context),
      ],
    },
    setupCoreModule({ backendRootUrl: Config.NF_BACKEND_URL }),
    appModule,
  );
};
