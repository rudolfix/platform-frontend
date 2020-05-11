import { call, fork, neuTakeLatest, put, SagaGenerator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, tokenPriceModuleApi } from "@neufund/shared-modules";
import { authModuleAPI } from "../auth/module";

import { walletContractsModuleApi } from "../contracts/module";
import { initActions } from "./actions";

/**
 * Init global watchers
 */
function* initGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* initStartSaga(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    yield* call(walletContractsModuleApi.sagas.initializeContracts);
    yield* call(initGlobalWatchers);

    // checks if we have credentials and automatically signs the user
    yield* call(authModuleAPI.sagas.trySignInExistingAccount);

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));

    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
