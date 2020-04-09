import { generateSharedModuleId } from "../../utils";
import { setupContainerModule } from "./lib/bindings";
import { IContractsService } from "./lib/ContractService";
import { IRateOracleAdapter } from "./lib/IRateOracleAdapter";
import { symbols } from "./lib/symbols";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("contracts");

type TModuleConfig = Parameters<typeof setupContainerModule>[0];

const setupContractsModule = (config: TModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupContainerModule(config)],
  api: contractsModuleApi,
});

const contractsModuleApi = {
  symbols,
  utils,
};

export { IRateOracleAdapter, IContractsService, setupContractsModule, contractsModuleApi };