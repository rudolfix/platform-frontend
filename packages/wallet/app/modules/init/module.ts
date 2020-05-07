import { setupCoreModule, setupTokenPriceModule } from "@neufund/shared-modules";

import { setupAuthModule } from "../auth/module";
import { setupWalletContractsModule } from "../contracts/module";
import { setupWalletEthModule } from "../eth/module";
import { setupNotificationUIModule } from "../notification-ui/module";
import { setupSignerUIModule } from "../signer-ui/module";
import { setupStorageModule } from "../storage";
import { setupWalletConnectModule } from "../wallet-connect/module";
import { setupDeviceInformationModule } from "../device-information/module";
import { initActions } from "./actions";
import { initReducersMap } from "./reducer";
import { initSaga } from "./sagas";
import { selectInitStatus } from "./selectors";
import { EInitStatus } from "./types";

const MODULE_ID = "wallet:init";

type TConfig = { backendRootUrl: string; rpcUrl: string; universeContractAddress: string };

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
    setupDeviceInformationModule(),
    ...setupAuthModule(),
    ...setupWalletContractsModule({ universeContractAddress: config.universeContractAddress }),
    setupTokenPriceModule({
      // TODO: When we have a proper block watching flow for mobile app provide proper refresh action
      refreshOnAction: undefined,
    }),
    initModule,
  ];
};

const initModuleApi = {
  actions: initActions,
  selectors: {
    selectInitStatus,
  },
};

export { setupInitModule, initModuleApi, EInitStatus };
