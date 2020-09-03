import {
  setupCoreModule,
  setupEtoModule,
  setupTokenPriceModule,
  setupInvestorPortfolioModule,
  setupKycModule,
  setupBookbuildingModule,
  setupWalletModule,
  setupGasModule,
} from "@neufund/shared-modules";

import { setupAuthModule } from "modules/auth/module";
import { setupBiometricsModule } from "modules/biometrics/module";
import { setupWalletContractsModule } from "modules/contracts/module";
import { setupDeviceInformationModule } from "modules/device-information/module";
import { setupWalletEthModule } from "modules/eth/module";
import { setupHomeScreenModule } from "modules/home-screen/module";
import { setupNotificationUIModule } from "modules/notification-ui/module";
import { setupNotificationsModule } from "modules/notifications/module";
import { setupPermissionsModule } from "modules/permissions/module";
import { setupPortfolioScreenModule } from "modules/portfolio-screen/module";
import { setupQRCodeScannerModule } from "modules/qr-code-scanner/module";
import { setupSignerUIModule } from "modules/signer-ui/module";
import { setupStorageModule } from "modules/storage";
import { setupWalletConnectModule } from "modules/wallet-connect/module";
import { setupWalletScreenModule } from "modules/wallet-screen/module";

import { initActions } from "./actions";
import { initReducersMap } from "./reducer";
import { initSaga } from "./sagas";
import { selectInitStatus } from "./selectors";
import { EInitStatus } from "./types";

const MODULE_ID = "wallet:init";

type TConfig = { backendRootUrl: string; rpcUrl: string; universeContractAddress: string };

const ensurePermissionsArePresentAndRunEffect = function*() {
  throw new Error("Not implemented");
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const waitUntilSmartContractsAreInitialized = function*() {};
const displayErrorModalSaga = function*() {
  throw new Error("Not implemented");
};

const setupInitModule = (config: TConfig) => {
  const initModule = {
    id: MODULE_ID,
    reducerMap: initReducersMap,
    sagas: [initSaga],
    api: initModuleApi,
  };

  return [
    /**
     * Shared modules
     */
    setupCoreModule({ backendRootUrl: config.backendRootUrl }),
    setupStorageModule(),
    setupNotificationsModule(),
    setupPermissionsModule(),
    setupDeviceInformationModule(),
    ...setupWalletEthModule({ rpcUrl: config.rpcUrl }),
    setupSignerUIModule(),
    setupNotificationUIModule(),
    setupWalletConnectModule(),
    setupQRCodeScannerModule(),
    setupGasModule(),
    setupTokenPriceModule({
      // TODO: When we have a proper block watching flow for mobile app provide proper refresh action
      refreshOnAction: undefined,
    }),
    setupKycModule({
      ensurePermissionsArePresentAndRunEffect,
      displayErrorModalSaga,
      waitUntilSmartContractsAreInitialized,
    }),
    ...setupWalletContractsModule({ universeContractAddress: config.universeContractAddress }),
    ...setupAuthModule(config.backendRootUrl),
    setupEtoModule(),
    setupBookbuildingModule({
      ensurePermissionsArePresentAndRunEffect,
      refreshOnAction: undefined,
    }),
    setupInvestorPortfolioModule(),
    setupWalletModule({
      waitUntilSmartContractsAreInitialized,
    }),
    setupBiometricsModule(),
    /**
     * Screen modules
     */
    ...setupWalletScreenModule(),
    ...setupHomeScreenModule(),
    ...setupPortfolioScreenModule(),

    /**
     * Root module
     */
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
