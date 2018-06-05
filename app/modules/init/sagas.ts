import { effects } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";

import { LocationChangeAction } from "react-router-redux";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { initializeContracts } from "../contracts/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { detectUserAgent } from "../userAgent/sagas";
import { loadPreviousWallet } from "../web3/sagas";

export function* setupSaga({ web3Manager, logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(detectUserAgent);
    yield web3Manager.initialize();

    const jwt = yield neuCall(loadJwt);

    if (jwt) {
      if (isJwtExpiringLateEnough(jwt)) {
        try {
          yield loadUser();
        } catch (e) {
          yield cleanupAndLogoutSaga();
          logger.error(
            "Cannot retrieve account. This could happen b/c account was deleted on backend",
          );
        }
      } else {
        yield cleanupAndLogoutSaga();
        logger.error("JTW expiring too soon.");
      }
    }

    yield neuCall(loadPreviousWallet);
    yield neuCall(initializeContracts);

    yield put(actions.init.done());
  } catch (e) {
    yield put(actions.init.error(e.message || "Unknown error"));
    logger.error("Error: ", e);
  }
}

export function* cleanupAndLogoutSaga(): Iterator<any> {
  yield put(actions.auth.logout());
  yield put(actions.routing.goToLogin());
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", setupSaga);

  /**
   * We don't require app initialization on every page so we are gonna watch location change action until we can init whole app
   */
  while (true) {
    const isDoneOrInProgress: boolean = yield select(
      (s: IAppState) => s.init.done || s.init.started,
    );
    if (isDoneOrInProgress) {
      return;
    }

    const action: LocationChangeAction = yield take("@@router/LOCATION_CHANGE");
    if (action.payload && action.payload.pathname !== "/") {
      yield put(actions.init.start());
    }
  }
};
