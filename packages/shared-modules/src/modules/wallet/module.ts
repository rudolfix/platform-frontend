import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { walletActions } from "./actions";
import { walletReducerMap } from "./reducer";
import { loadWalletDataAsync, loadWalletDataSaga, setupWalletSagas } from "./sagas";
import * as selectors from "./selectors";
import { ILockedWallet, IWalletStateData } from "./types";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("wallet");

type Config = Parameters<typeof setupWalletSagas>[0];

const setupWalletModule = (config: Config) => {
  const module = {
    id: MODULE_ID,
    api: walletApi,
    sagas: [setupWalletSagas(config)],
    reducerMap: walletReducerMap,
  };

  return module;
};

const walletApi = {
  actions: walletActions,
  selectors,
  utils,
  reducer: walletReducerMap,
  sagas: {
    loadWalletDataSaga,
    loadWalletDataAsync,
  },
};

export { setupWalletModule, walletReducerMap, walletApi, ILockedWallet, IWalletStateData };

export type TPureWalletModuleState = TModuleState<typeof setupWalletModule>;
export type TWalletModuleState = TPureWalletModuleState & TPureTokenPriceModuleState;
