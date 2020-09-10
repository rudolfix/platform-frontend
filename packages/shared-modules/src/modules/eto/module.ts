import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TAuthModuleState } from "../auth/module";
import { TPureBookbuildingModuleState } from "../bookbuilding/module";
import { TPureInvestorPortfolioModuleState } from "../investor-portfolio/module";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { TPureWalletModuleState } from "../wallet/module";
import { etoActions } from "./actions";
import { setupContainerModule } from "./lib/bindings";
import { symbols } from "./lib/symbols";
import { etoReducerMap } from "./reducer";
import {
  getEtoContract,
  getEtoRefreshStrategies,
  loadAdditionalEtoData,
  loadCapitalIncrease,
  loadEtoContract,
  loadEtos,
  loadEtoWithCompanyAndContract,
  loadEtoWithCompanyAndContractById,
  loadInvestmentAgreement,
  raceStrategies,
  setupEtoSagas,
} from "./sagas";
import * as selectors from "./selectors";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("eto");

const setupEtoModule = () => {
  const module = {
    id: MODULE_ID,
    api: etoModuleApi,
    libs: [setupContainerModule()],
    sagas: [setupEtoSagas()],
    reducerMap: etoReducerMap,
  };

  return module;
};

const etoModuleApi = {
  actions: etoActions,
  selectors,
  symbols,
  utils,
  sagas: {
    loadAdditionalEtoData,
    loadEtoContract,
    loadEtoWithCompanyAndContract,
    loadEtoWithCompanyAndContractById,
    getEtoRefreshStrategies,
    raceStrategies,
    loadInvestmentAgreement,
    loadCapitalIncrease,
    getEtoContract,
    loadEtos,
  },
};

export { setupEtoModule, etoModuleApi };
export type TPureEtoModuleState = TModuleState<typeof setupEtoModule>;
export type TEtoModuleState = TPureEtoModuleState &
  TPureInvestorPortfolioModuleState &
  TPureBookbuildingModuleState &
  TPureTokenPriceModuleState &
  TPureWalletModuleState &
  TAuthModuleState;

export { EtoMessage } from "./messages";
export * from "./lib/http/eto-api/EtoApi.interfaces";
export * from "./lib/http/eto-api/EtoFileApi.interfaces";
export * from "./lib/http/eto-api/EtoProductsApi.interfaces";
export * from "./lib/http/eto-api/EtoTokensApi.interfaces";
export * from "./lib/http/eto-api/EtoFileApi";
export * from "./lib/http/eto-api/EtoUtils";
export * from "./lib/http/eto-api/EtoApiUtils";
export * from "./lib/http/eto-api/EtoFileUtils";
export * from "./lib/http/eto-api/EtoNomineeApi";

export * from "./types";
export * from "./errors";
