import { call, SagaGenerator, takeLatest, put, all } from "@neufund/sagas";
import {
  coreModuleApi,
  etoModuleApi,
  investorPortfolioModuleApi,
  neuGetBindings,
  walletApi,
} from "@neufund/shared-modules";

import { EScreenState } from "modules/types";

import { actions } from "./actions";

function* getHomeScreenData(
  loadingState: EScreenState.LOADING | EScreenState.REFRESHING,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield put(actions.setHomeScreenState(loadingState));

    yield* all([
      call(etoModuleApi.sagas.loadEtos),
      call(investorPortfolioModuleApi.sagas.loadClaimables),
      call(walletApi.sagas.loadWalletDataSaga),
    ]);

    yield put(actions.setHomeScreenState(EScreenState.READY));
  } catch (e) {
    logger.error(e, "Failed to load home view");

    yield put(actions.setHomeScreenState(EScreenState.ERROR));
  }
}

export function* homeScreenSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadHomeScreen, getHomeScreenData, EScreenState.LOADING);
  yield takeLatest(actions.refreshHomeScreen, getHomeScreenData, EScreenState.REFRESHING);
}
