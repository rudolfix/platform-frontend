import { SagaGenerator, takeLatest, put, call, all } from "@neufund/sagas";
import {
  coreModuleApi,
  neuGetBindings,
  etoModuleApi,
  investorPortfolioModuleApi,
  walletApi,
} from "@neufund/shared-modules";

import { EScreenState } from "modules/types";

import { actions } from "./actions";

function* getScreenData(
  loadingState: EScreenState.LOADING | EScreenState.REFRESHING,
): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield put(actions.setPortfolioScreenState(loadingState));

    yield* all([
      call(etoModuleApi.sagas.loadEtos),
      call(investorPortfolioModuleApi.sagas.loadClaimables),
      call(walletApi.sagas.loadWalletDataSaga),
    ]);

    yield put(actions.setPortfolioScreenState(EScreenState.READY));
  } catch (e) {
    logger.error(e, "Failed to load home view");

    yield put(actions.setPortfolioScreenState(EScreenState.ERROR));
  }
}

export function* portfolioScreenSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadPortfolioScreen, getScreenData, EScreenState.LOADING);
  yield takeLatest(actions.refreshPortfolioScreen, getScreenData, EScreenState.REFRESHING);
}
