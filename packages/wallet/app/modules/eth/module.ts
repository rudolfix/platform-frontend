import { utils as ethersUtils } from "ethers";

import { setupDeviceInformationModule } from "modules/device-information/module";
import { SecureStorageAccessCancelled, SecureStorageUnknownError } from "modules/eth/lib/errors";
import { EWalletExistenceStatus, EWalletType } from "modules/eth/lib/types";
import { setupStorageModule } from "modules/storage";

import { setupBindings } from "./lib/bindings";
import {
  ethereumAddress,
  ethereumHdPath,
  ethereumMnemonic,
  ethereumPrivateKey,
} from "./lib/schemas";
import { symbols } from "./lib/symbols";
import { isMnemonic, isPrivateKey } from "./lib/utils";

type TEthModuleConfig = {
  rpcUrl: string;
};

const MODULE_ID = "wallet:eth";

const utils = {
  isMnemonic,
  isPrivateKey,
  ethereumAddress,
  ethereumHdPath,
  ethereumPrivateKey,
  ethereumMnemonic,
  BigNumber: ethersUtils.BigNumber,
};

const setupWalletEthModule = (config: TEthModuleConfig) => {
  const module = {
    id: MODULE_ID,
    libs: [setupBindings(config.rpcUrl)],
    api: walletEthModuleApi,
  };

  return [setupDeviceInformationModule(), setupStorageModule(), module];
};

const walletEthModuleApi = {
  symbols,
  utils,
  errors: {
    SecureStorageAccessCancelled,
    SecureStorageUnknownError,
  },
};

export { setupWalletEthModule, walletEthModuleApi, EWalletExistenceStatus, EWalletType };
