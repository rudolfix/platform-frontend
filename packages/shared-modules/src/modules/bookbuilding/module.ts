import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TAuthModuleState } from "../auth/module";
import { TPureEtoModuleState } from "../eto/module";
import { TPureInvestorPortfolioModuleState } from "../investor-portfolio/module";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { TPureWalletModuleState } from "../wallet/module";
import { bookbuildingActions } from "./actions";
import { setupContainerModule } from "./bindings";
import { bookbuildingReducerMap } from "./reducer";
import * as sagas from "./sagas";
import * as selectors from "./selectors";
import { symbols } from "./symbols";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("bookbuilding");
type Config = Parameters<typeof sagas.setupBookbuildingSagas>[0];

const setupBookbuildingModule = (config: Config) => {
  const module = {
    id: MODULE_ID,
    api: bookbuildingModuleApi,
    libs: [setupContainerModule()],
    sagas: [sagas.setupBookbuildingSagas(config)],
    reducerMap: bookbuildingReducerMap,
  };

  return module;
};

const bookbuildingModuleApi = {
  actions: bookbuildingActions,
  selectors,
  utils,
  symbols,
};

export { setupBookbuildingModule, bookbuildingModuleApi };
export type TPureBookbuildingModuleState = TModuleState<typeof setupBookbuildingModule>;
export type TBookbuildingModuleState = TPureBookbuildingModuleState &
  TPureEtoModuleState &
  TPureTokenPriceModuleState &
  TPureWalletModuleState &
  TAuthModuleState &
  TPureInvestorPortfolioModuleState;

export * from "./messages";
export * from "./types";
export * from "./lib/http/eto-pledge-api/EtoPledgeApi.interfaces.unsafe";
