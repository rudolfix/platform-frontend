import { createStore, getSagaExtension } from "@neufund/sagas";
import {
  getContextToDepsExtension,
  getLoadContextExtension,
  INeuModule,
  setupCoreModule,
} from "@neufund/shared-modules";
import { Container } from "inversify";
import Config from "react-native-config";

import { createGlobalDependencies, setupBindings, TGlobalDependencies } from "../di/setupBindings";
import { TConfig } from "../di/types";
import { setupWalletEthModule } from "../modules/eth/module";
import { appReducers } from "../modules/reducers";
import { rootSaga } from "../modules/sagas";
import { TAppGlobalState } from "./types";
import { setupStorageModule } from "../modules/storage";
import {setupNotificationsModule} from "../modules/notifications/module";

export const createAppStore = (container: Container) => {
  const config: TConfig = {
    backendRootUrl: Config.NF_BACKEND_URL,
    rpcUrl: Config.NF_NODE_RPC_URL,
  };

  const appModule: INeuModule<TAppGlobalState> = {
    id: "app",
    reducerMap: appReducers,
    libs: [setupBindings(config)],
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
    setupCoreModule({ backendRootUrl: config.backendRootUrl }),
    setupStorageModule(),
    setupNotificationsModule(),
    setupWalletEthModule({ rpcUrl: config.rpcUrl }),
    appModule,
  );
};
