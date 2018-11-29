import { effects } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { isJwtExpiringLateEnough } from "../../utils/JWTUtils";
import { actions, TAction } from "../actions";
import { loadJwt, loadUser } from "../auth/sagas";
import { selectUserType } from "../auth/selectors";
import { initializeContracts } from "../contracts/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { detectUserAgent } from "../user-agent/sagas";

function* initSmartcontracts({ web3Manager, logger }: TGlobalDependencies): any {
  try {
    yield web3Manager.initialize();

    yield neuCall(initializeContracts);

    yield put(actions.init.done("smartcontractsInit"));
  } catch (e) {
    yield put(
      actions.init.error("smartcontractsInit", "Error while connecting with Ethereum blockchain"),
    );
    logger.error("Smart Contract Init Error", e);
  }
}

function* initApp({ logger }: TGlobalDependencies): any {
  try {
    yield neuCall(detectUserAgent);

    const jwt = yield neuCall(loadJwt);
    const userType = yield select(selectUserType);

    if (jwt) {
      if (isJwtExpiringLateEnough(jwt)) {
        try {
          // we need to initiate smartcontracts anyway to load user properly
          if (yield checkIfSmartcontractsInitNeeded()) {
            yield neuCall(initSmartcontracts);
          }
          yield loadUser();
        } catch (e) {
          yield put(actions.auth.logout(userType));
          logger.error(
            "Cannot retrieve account. This could happen b/c account was deleted on backend",
          );
        }
      } else {
        yield put(actions.auth.logout(userType));
        logger.warn("JTW expiring too soon.");
      }
    }

    yield put(actions.init.done("appInit"));
  } catch (e) {
    yield put(actions.init.error("appInit", e.message || "Unknown error"));
    logger.error("App init error", e);
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

export function* checkIfSmartcontractsInitNeeded(): any {
  const isDoneOrInProgress: boolean = yield select(
    (s: IAppState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
  );

  return !isDoneOrInProgress;
}

export function* initSmartcontractsOnce(): any {
  const isNeeded = yield checkIfSmartcontractsInitNeeded();
  if (!isNeeded) {
    return;
  }

  yield put(actions.init.start("smartcontractsInit"));
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);
  // Smart Contracts are only initialized once during the whole life cycle of the app
  yield fork(initSmartcontractsOnce);
};
