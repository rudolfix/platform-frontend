import { generateSharedModuleId } from "../../utils";
import { setupContainerModule } from "./lib/bindings";
import { IContractsService } from "./lib/ContractService";
import { IControllerGovernanceAdapter } from "./lib/IControllerGovernanceAdapter";
import { IEquityTokenAdapter } from "./lib/IEquityTokenAdapter";
import { IERC20TokenAdapter } from "./lib/IERC20TokenAdapter";
import { IETOCommitmentAdapter } from "./lib/IETOCommitmentAdapter";
import { IETOTermsAdapter } from "./lib/IETOTermsAdapter";
import { IFeeDisbursalAdapter } from "./lib/IFeeDisbursalAdapter";
import { IIdentityRegistryAdapter } from "./lib/IIdentityRegistryAdapter";
import { IICBMLockedAccountAdapter, ILockedAccountAdapter } from "./lib/ILockedAccountAdapter";
import { IRateOracleAdapter } from "./lib/IRateOracleAdapter";
import { ISnapshotableTokenAdapter } from "./lib/ISnapshotableTokenAdapter";
import { ITokenControllerAdapter } from "./lib/ITokenControllerAdapter";
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

export {
  IRateOracleAdapter,
  IContractsService,
  setupContractsModule,
  contractsModuleApi,
  ILockedAccountAdapter,
  IERC20TokenAdapter,
  IICBMLockedAccountAdapter,
  IIdentityRegistryAdapter,
  IETOCommitmentAdapter,
  IFeeDisbursalAdapter,
  IETOTermsAdapter,
  ITokenControllerAdapter,
  IControllerGovernanceAdapter,
  ISnapshotableTokenAdapter,
  IEquityTokenAdapter,
};
