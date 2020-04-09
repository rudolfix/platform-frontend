import { setupCoreModule } from "@neufund/shared-modules";

import { setupAuthModule } from "../auth/module";
import { setupWalletEthModule } from "../eth/module";
import { setupNotificationUIModule } from "../notification-ui/module";
import { setupSignerUIModule } from "../signer-ui/module";
import { setupStorageModule } from "../storage";
import { setupWalletConnectModule } from "../wallet-connect/module";
import { initActions } from "./actions";
import { initReducersMap } from "./reducer";
import { initSaga } from "./sagas";

const MODULE_ID = "wallet:init";

type TConfig = { backendRootUrl: string; rpcUrl: string };

const setupInitModule = (config: TConfig) => {
  const initModule = {
    id: MODULE_ID,
    reducerMap: initReducersMap,
    sagas: [initSaga],
    api: initModuleApi,
  };

  return [
    setupCoreModule({ backendRootUrl: config.backendRootUrl }),
    setupStorageModule(),
    setupWalletEthModule({ rpcUrl: config.rpcUrl }),
    setupSignerUIModule(),
    setupNotificationUIModule(),
    setupWalletConnectModule(),
    ...setupAuthModule(),
    initModule,
  ];
};

const initModuleApi = {
  actions: initActions,
};

export { setupInitModule, initModuleApi };
