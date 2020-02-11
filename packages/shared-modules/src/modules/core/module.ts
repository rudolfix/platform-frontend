import { setupContainerModule } from "./lib/bindings";
import { ILogger, noopLogger } from "./lib/logger/index";
import { symbols } from "./lib/symbols";

type TCoreModuleConfig = {
  backendRootUrl: string;
};

const MODULE_ID = "core";

const setupCoreModule = (config: TCoreModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupContainerModule(config.backendRootUrl)],
  api: coreModuleApi,
});

const coreModuleApi = {
  symbols,
};

export { setupCoreModule, coreModuleApi, ILogger, noopLogger };
