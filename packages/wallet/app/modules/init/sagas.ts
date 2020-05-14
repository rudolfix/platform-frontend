import { neuTakeLatest, put, fork, call, SagaGenerator } from "@neufund/sagas";
import { tokenPriceModuleApi } from "@neufund/shared-modules";
import { TGlobalDependencies } from "../../di/setupBindings";
import { walletContractsModuleApi } from "../contracts/module";
import { authModuleAPI } from "../auth/module";
import { initActions } from "./actions";

/**
 * Init global watchers
 */
function* initGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* initStartSaga({ logger, notifications }: TGlobalDependencies): Generator<unknown, void> {
  try {
    yield* call(walletContractsModuleApi.sagas.initializeContracts);
    yield* call(initGlobalWatchers);

    // checks if we have credentials and automatically signs the user
    yield* call(authModuleAPI.sagas.trySignInExistingAccount);

    // init push notifications
    yield notifications.init();

    // subscribe for notifications test
    notifications.onReceivedNotificationInForeground(
      notification => {
        console.log("------event work--------", notification);
      },
      { alert: true, sound: true, badge: false },
    );

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));

    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
