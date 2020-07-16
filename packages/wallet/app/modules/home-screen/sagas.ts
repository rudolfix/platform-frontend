import { call, SagaGenerator, takeLatest, put, all } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, walletApi } from "@neufund/shared-modules";

import { EViewState } from "modules/wallet-screen/types";

import { actions } from "./actions";

function* getHomeViewData(
  loadingState: EViewState.LOADING | EViewState.REFRESHING,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield put(actions.setHomeViewState(loadingState));

    yield* all([call(walletApi.sagas.loadWalletDataSaga)]);

    yield put(actions.setHomeViewState(EViewState.READY));
  } catch (e) {
    logger.error(e, "Failed to load home view");

    yield put(actions.setHomeViewState(EViewState.ERROR));
  }
}

export function* homeViewSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadHomeView, getHomeViewData, EViewState.LOADING);
  yield takeLatest(actions.refreshHomeView, getHomeViewData, EViewState.REFRESHING);
}
