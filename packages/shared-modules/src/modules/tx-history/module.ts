import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TPureTokenPriceModuleState } from "../token-price/module";
import { txHistoryActions } from "./actions";
import { setupContainerModule } from "./bindings";
import { txHistoryReducerMap } from "./reducer";
import { loadTransactionsHistory, setupTXHistorySagas } from "./sagas";
import * as selectors from "./selectors";

export {
  ETransactionDirection,
  ETransactionType,
  ETransactionStatus,
  ETransactionSubType,
  TExtractTxHistoryFromType,
  TTxHistory,
} from "./types";

export { ETxHistoryMessage } from "./messages";
export { EModuleStatus } from "./reducer";

const MODULE_ID = generateSharedModuleId("tx-history");

type Config = Parameters<typeof setupTXHistorySagas>[0];

const setupTxHistoryModule = (config: Config) => {
  const module = {
    id: MODULE_ID,
    api: txHistoryApi,
    libs: [setupContainerModule()],
    sagas: [setupTXHistorySagas(config)],
    reducerMap: txHistoryReducerMap,
  };

  return module;
};

const txHistoryApi = {
  actions: txHistoryActions,
  selectors,
  sagas: {
    loadTransactionsHistory,
  },
};

export { setupTxHistoryModule, txHistoryApi };

export type TPureTxHistoryModuleState = TModuleState<typeof setupTxHistoryModule>;
export type TTxHistoryModuleState = TPureTxHistoryModuleState & TPureTokenPriceModuleState;
