import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { IAppState } from "./../../store";
import { selectUserType } from "./../auth/selectors";

import { TGlobalDependencies } from "../../di/setupBindings";
import { TUserType } from "../../lib/api/users/interfaces";
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
  const userType: TUserType = yield effects.select((s: IAppState) => selectUserType(s.auth));
  yield put(actions.auth.logout(userType));
  userType === "investor"
    ? yield put(actions.routing.goToLogin())
    : yield put(actions.routing.goToEtoLogin());
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", setupSaga);
};
