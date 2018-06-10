import { effects } from "redux-saga";
import { fork, put, select, take } from "redux-saga/effects";

import { LocationChangeAction } from "react-router-redux";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions, TAction } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { initializeContracts } from "../contracts/sagas";
import { neuCall, neuTakeEvery } from "../sagas";
import { detectUserAgent } from "../userAgent/sagas";
import { loadPreviousWallet } from "../web3/sagas";

function* initSmartcontracts({ web3Manager, logger }: TGlobalDependencies): any {
  try {
    yield web3Manager.initialize();
    yield neuCall(initializeContracts);

    yield put(actions.init.done("smartcontractsInit"));
  } catch (e) {
    yield put(
      actions.init.error("smartcontractsInit", "Error while connecting with smartcontracts :("),
    );
    logger.error("Error: ", e);
  }
}

function* initApp({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(detectUserAgent);

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

    yield put(actions.init.done("appInit"));
  } catch (e) {
    yield put(actions.init.error("appInit", e.message || "Unknown error"));
    logger.error("Error: ", e);
  }
}

export function* initStartSaga(_: TGlobalDependencies, action: TAction): Iterator<any> {
  if (action.type !== "INIT_START") return;

  const { initType } = action.payload;

  switch (initType) {
    case "appInit":
      return yield neuCall(initApp);
    case "smartcontractsInit":
      return yield neuCall(initSmartcontracts);
    default:
      throw new Error("Unrecognized init type!");
  }
}

export function* cleanupAndLogoutSaga(): Iterator<any> {
  yield put(actions.auth.logout());
  yield put(actions.routing.goToLogin());
}

/**
 * We don't require app initialization on every page so we are gonna watch location change action until we can init whole app
 */
export function* initSmartcontractsDelayed(): any {
  while (true) {
    const isDoneOrInProgress: boolean = yield select(
      (s: IAppState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
    );
    if (isDoneOrInProgress) {
      return;
    }

    const action: LocationChangeAction = yield take("@@router/LOCATION_CHANGE");

    if (action.payload && action.payload.pathname !== "/") {
      yield put(actions.init.start("smartcontractsInit"));
      return;
    }
  }
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);

  yield fork(initSmartcontractsDelayed);
};
