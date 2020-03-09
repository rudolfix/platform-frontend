import { setupBindings } from "./lib/bindings";
import { symbols } from "./lib/symbols";
import { isAddress, isMnemonic, isPrivateKey } from "./lib/utils";

type TEthModuleConfig = {
  rpcUrl: string;
};

const MODULE_ID = "wallet:eth";

const utils = {
  isAddress,
  isMnemonic,
  isPrivateKey,
};

const setupWalletEthModule = (config: TEthModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupBindings(config.rpcUrl)],
  api: walletEthModuleApi,
});

const walletEthModuleApi = {
  symbols,
  utils,
};

export { setupWalletEthModule, walletEthModuleApi };
