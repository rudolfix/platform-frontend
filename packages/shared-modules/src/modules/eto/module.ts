import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TAuthModuleState } from "../auth/module";
import { TPureBookbuildingModuleState } from "../bookbuilding/module";
import { TPureInvestorPortfolioModuleState } from "../investor-portfolio/module";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { TPureWalletModuleState } from "../wallet/module";
import { etoActions } from "./actions";
import { setupContainerModule } from "./bindings";
import { etoReducerMap } from "./reducer";
import * as sagas from "./sagas";
import * as selectors from "./selectors";
import { symbols } from "./symbols";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("eto");

const setupEtoModule = () => {
  const module = {
    id: MODULE_ID,
    api: etoModuleApi,
    libs: [setupContainerModule()],
    sagas: [sagas.setupEtoSagas()],
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
    loadAdditionalEtoData: sagas.loadAdditionalEtoData,
    loadEtoContract: sagas.loadEtoContract,
    loadEtoWithCompanyAndContract: sagas.loadEtoWithCompanyAndContract,
    loadEtoWithCompanyAndContractById: sagas.loadEtoWithCompanyAndContractById,
    getEtoRefreshStrategies: sagas.getEtoRefreshStrategies,
    raceStrategies: sagas.raceStrategies,
    loadInvestmentAgreement: sagas.loadInvestmentAgreement,
    loadCapitalIncrease: sagas.loadCapitalIncrease,
    getEtoContract: sagas.getEtoContract,
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
export * from "./lib/http/eto-api/EtoApi.interfaces.unsafe";
export * from "./lib/http/eto-api/EtoFileApi.interfaces";
export * from "./lib/http/eto-api/EtoProductsApi.interfaces";
export * from "./lib/http/eto-api/EtoFileApi";
export * from "./lib/http/eto-api/EtoUtils";
export * from "./lib/http/eto-api/EtoApiUtils";
export * from "./lib/http/eto-api/EtoFileUtils";
export * from "./lib/http/eto-api/EtoNomineeApi";

export * from "./types";
export * from "./errors";
