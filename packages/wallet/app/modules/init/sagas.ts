import { neuTakeLatest, put, fork, call, SagaGenerator, select } from "@neufund/sagas";
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
function* initGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* initStartSaga(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });
  try {
    yield* call(initGlobalModules);
    yield* call(initGlobalWatchers);

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

function* initAuthSigned(): SagaGenerator<void> {
  yield* call(walletConnectModuleApi.sagas.tryToConnectExistingSession);

  yield* call(kycApi.sagas.loadKycRequestData);
}

function* initAuthLogoutDone(): SagaGenerator<void> {
  const peer = yield* select((state: TAppGlobalState) =>
    walletConnectModuleApi.selectors.selectWalletConnectPeer(state),
  );

  if (peer) {
    yield put(walletConnectActions.disconnectFromPeerSilent(peer.id));
  }
}

export function* initSaga(): SagaGenerator<void> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
  yield fork(neuTakeLatest, authActions.unlockAccountDone, initAuthSigned);
  yield fork(neuTakeLatest, authActions.logoutAccountDone, initAuthLogoutDone);
}
