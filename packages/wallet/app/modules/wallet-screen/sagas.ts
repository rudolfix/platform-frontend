import { call, SagaGenerator, takeLatest, put, all } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, walletApi, txHistoryApi } from "@neufund/shared-modules";

import { EViewState } from "modules/wallet-screen/types";

import { actions } from "./actions";

function* getWalletViewData(
  loadingState: EViewState.LOADING | EViewState.REFRESHING,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield put(actions.setWalletViewState(loadingState));

    yield* all([
      call(walletApi.sagas.loadWalletDataSaga),
      call(txHistoryApi.sagas.loadTransactionsHistory),
    ]);

    yield put(actions.setWalletViewState(EViewState.READY));
  } catch (e) {
    logger.error(e, "Failed to load wallet view");

    yield put(actions.setWalletViewState(EViewState.ERROR));
  }
}

export function* walletViewSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadWalletView, getWalletViewData, EViewState.LOADING);
  yield takeLatest(actions.refreshWalletView, getWalletViewData, EViewState.REFRESHING);
}
