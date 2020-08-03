import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TAuthModuleState } from "../auth/module";
import { TPureBookbuildingModuleState } from "../bookbuilding/module";
import { TPureEtoModuleState } from "../eto/module";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { TPureWalletModuleState } from "../wallet/module";
import { investorPortfolioActions } from "./actions";
import { investorPortfolioReducerMap } from "./reducer";
import {
  loadClaimables,
  loadComputedContributionFromContract,
  setupInvestorPortfolioSagas,
} from "./sagas";
import * as selectors from "./selectors";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("investor-portfolio");

const setupInvestorPortfolioModule = () => {
  const module = {
    id: MODULE_ID,
    api: investorPortfolioModuleApi,
    libs: [],
    sagas: [setupInvestorPortfolioSagas()],
    reducerMap: investorPortfolioReducerMap,
  };

  return module;
};

const investorPortfolioModuleApi = {
  actions: investorPortfolioActions,
  selectors,
  utils,
  sagas: {
    loadComputedContributionFromContract,
    loadClaimables,
  },
};

export { setupInvestorPortfolioModule, investorPortfolioModuleApi };

export type TPureInvestorPortfolioModuleState = TModuleState<typeof setupInvestorPortfolioModule>;
export type TInvestorPortfolioModuleState = TPureInvestorPortfolioModuleState &
  TPureBookbuildingModuleState &
  TPureEtoModuleState &
  TPureTokenPriceModuleState &
  TAuthModuleState &
  TPureWalletModuleState;

export * from "./messages";
export * from "./types";
