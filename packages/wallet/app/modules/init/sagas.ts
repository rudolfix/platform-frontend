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
import { walletContractsModuleApi } from "modules/contracts/module";
import { notificationModuleApi } from "modules/notifications/module";
import { walletConnectActions } from "modules/wallet-connect/actions";
import { walletConnectModuleApi } from "modules/wallet-connect/module";

import { TAppGlobalState } from "store/types";

import { initActions } from "./actions";

/**
 * Init global watchers
 */
function* initGlobalWatchers(): SagaGenerator<void> {
  yield put(tokenPriceModuleApi.actions.watchTokenPriceStart());
}

function* initStartSaga(): SagaGenerator<void> {
  const { logger, notifications } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    notifications: notificationModuleApi.symbols.notifications,
  });
  try {
    yield* call(walletContractsModuleApi.sagas.initializeContracts);
    yield* call(initGlobalWatchers);

    // checks if we have credentials and automatically signs the user
    yield* call(authModuleAPI.sagas.trySignInExistingAccount);

    yield put(initActions.done());

    // TODO: Move push notification from initStartSaga
    //       as it won't work given until `done` is dispatched there is a splash screen
    //       and it's not possible to accept permissions request

    // init push notifications
    yield* call(() => notifications.init());

    // subscribe for notifications test
    yield* call(() =>
      notifications.onReceivedNotificationInForeground(
        notification => {
          logger.info("------event work--------", notification);
        },
        { alert: true, sound: true, badge: false },
      ),
    );
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
  yield fork(neuTakeLatest, authActions.signed, initAuthSigned);
  yield fork(neuTakeLatest, authActions.logoutDone, initAuthLogoutDone);
}
