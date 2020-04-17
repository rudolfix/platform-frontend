import { createStore, getSagaExtension } from "@neufund/sagas";
import {
  getContextToDepsExtension,
  getLoadContextExtension,
  INeuModule,
  setupCoreModule,
  setupTokenPriceModule,
} from "@neufund/shared-modules";
import { Container } from "inversify";
import Config from "react-native-config";

import { createGlobalDependencies, setupBindings, TGlobalDependencies } from "../di/setupBindings";
import { TConfig } from "../di/types";
import { setupWalletContractsModule } from "../modules/contracts/module";
import { setupAuthModule } from "../modules/auth/module";
import { setupWalletEthModule } from "../modules/eth/module";
import { setupNotificationUIModule } from "../modules/notification-ui/module";
import { appReducers } from "../modules/reducers";
import { rootSaga } from "../modules/sagas";
import { setupSignerUIModule } from "../modules/signer-ui/module";
import { setupWalletConnectModule } from "../modules/wallet-connect/module";
import { TAppGlobalState } from "./types";
import { setupStorageModule } from "../modules/storage";

export const createAppStore = (container: Container) => {
  // TODO: Take universe address from artifacts meta.json
  const UNIVERSE_ADDRESS = "0x9bad13807cd939c7946008e3772da819bd98fa7b";

  const config: TConfig = {
    backendRootUrl: Config.NF_BACKEND_URL,
    rpcUrl: Config.NF_NODE_RPC_URL,
    universeContractAddress: UNIVERSE_ADDRESS,
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

  return createStore<TAppGlobalState>(
    {
      extensions: [
        getLoadContextExtension(context.container),
        getContextToDepsExtension(appModule, createGlobalDependencies, context),
        getSagaExtension(context),
      ],
    },
    setupCoreModule({ backendRootUrl: config.backendRootUrl }),
    setupStorageModule(),
    setupWalletEthModule({ rpcUrl: config.rpcUrl }),
    ...setupWalletContractsModule({ universeContractAddress: config.universeContractAddress }),
    setupSignerUIModule(),
    setupNotificationUIModule(),
    setupWalletConnectModule(),
    setupTokenPriceModule({
      // TODO: When we have a proper block watching flow for mobile app provide proper refresh action
      refreshOnAction: undefined,
    }),
    ...setupAuthModule(),
    appModule,
  );
};
