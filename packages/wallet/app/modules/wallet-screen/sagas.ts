import { call, SagaGenerator, takeLatest, put, all } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, walletApi, txHistoryApi } from "@neufund/shared-modules";

import { EScreenState } from "modules/types";

import { actions } from "./actions";

function* getWalletScreenData(
  loadingState: EScreenState.LOADING | EScreenState.REFRESHING,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield put(actions.setWalletScreenState(loadingState));

    yield* all([
      call(walletApi.sagas.loadWalletDataSaga),
      call(txHistoryApi.sagas.loadTransactionsHistory),
    ]);

    yield put(actions.setWalletScreenState(EScreenState.READY));
  } catch (e) {
    logger.error(e, "Failed to load wallet view");

    yield put(actions.setWalletScreenState(EScreenState.ERROR));
  }
}

export function* walletScreenSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadWalletScreen, getWalletScreenData, EScreenState.LOADING);
  yield takeLatest(actions.refreshWalletScreen, getWalletScreenData, EScreenState.REFRESHING);
}
