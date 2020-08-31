import { call, fork, neuTakeLatest, put, SagaGenerator, select, take } from "@neufund/sagas";
import {
  coreModuleApi,
  kycApi,
  neuGetBindings,
  tokenPriceModuleApi,
} from "@neufund/shared-modules";
import { assertError } from "@neufund/shared-utils";

import { authActions } from "modules/auth/actions";
import { authModuleAPI } from "modules/auth/module";
import { biometricsModuleApi } from "modules/biometrics/module";
import { walletContractsModuleApi } from "modules/contracts/module";
import { appStateChannel } from "modules/utils";
import { walletConnectActions } from "modules/wallet-connect/actions";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { TAppGlobalState } from "store/types";

import { initActions } from "./actions";

function* initGlobalModules(): SagaGenerator<void> {
  yield* call(walletContractsModuleApi.sagas.initializeContracts);
  yield* call(biometricsModuleApi.sagas.initializeBiometrics);
}
/**
 * Init global watchers
 */
function* startGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* stopGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStop());
}

function* initStartSaga(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    yield* call(initGlobalModules);

    // checks if we have credentials and automatically signs the user
    const isBiometryAvailable = yield* select(
      biometricsModuleApi.selectors.selectIsBiometricsAvailable,
    );

    // when there is not biometry support calling `trySignInExistingAccount` will fail on credentials check
    if (isBiometryAvailable) {
      yield* call(authModuleAPI.sagas.trySignInExistingAccount);
    }

    yield put(initActions.done());
  } catch (e) {
    assertError(e);

    yield put(initActions.error(e?.message ?? "Unknown error"));

    logger.error(e, "App init error");
  }
}

function* handleAppStateChanges(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const stateChannel = yield* call(appStateChannel);

    while (true) {
      const { nextState, currentState } = yield* take(stateChannel);

      if (nextState === "background") {
        const isAuthorized = yield* select(authModuleAPI.selectors.selectIsAuthorized);

        if (isAuthorized) {
          // lock account when app moves to background
          yield put(authModuleAPI.actions.lockAccount());
        }
      }

      if (nextState === "active" && currentState === "background") {
        const isAuthorized = yield* select(authModuleAPI.selectors.selectIsAuthorized);

        if (!isAuthorized) {
          // checks if we have credentials and automatically signs the user
          yield* call(authModuleAPI.sagas.trySignInExistingAccount);
        }
      }
    }
  } catch (e) {
    assertError(e);

    logger.error(e, "Failed to handle app state change");

    yield put(initActions.error(e?.message ?? "Unknown error"));
  }
}

function* initAuthSigned(): SagaGenerator<void> {
  yield* call(walletConnectModuleApi.sagas.tryToConnectExistingSession);

  yield* call(kycApi.sagas.loadKycRequestData);

  yield* call(startGlobalWatchers);
}

function* initAuthLogoutDone(): SagaGenerator<void> {
  const peer = yield* select((state: TAppGlobalState) =>
    walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
  );

  if (peer) {
    yield put(walletConnectActions.disconnectFromPeerSilent(peer.id));
  }

  yield* call(stopGlobalWatchers);
}

export function* initSaga(): SagaGenerator<void> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
  yield fork(neuTakeLatest, authActions.unlockAccountDone, initAuthSigned);
  yield fork(
    neuTakeLatest,
    [authActions.logoutAccountDone, authActions.lockAccountDone],
    initAuthLogoutDone,
  );
  yield fork(neuTakeLatest, initActions.done, handleAppStateChanges);
}
