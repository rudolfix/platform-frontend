import { utils as ethersUtils } from "ethers";

import { SecureStorageAccessCancelled, SecureStorageUnknownError } from "modules/eth/lib/errors";

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

const setupWalletEthModule = (config: TEthModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupBindings(config.rpcUrl)],
  api: walletEthModuleApi,
});

const walletEthModuleApi = {
  symbols,
  utils,
  errors: {
    SecureStorageAccessCancelled,
    SecureStorageUnknownError,
  },
};

export { setupWalletEthModule, walletEthModuleApi };
