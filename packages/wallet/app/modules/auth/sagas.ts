import { neuTakeLatest, put, fork, call, neuCall } from "@neufund/sagas";
import {
  coreModuleApi,
  neuGetBindings,
  authModuleAPI,
  EUserType,
  EWalletType,
  EWalletSubType,
} from "@neufund/shared-modules";
import { isJwtExpiringLateEnough } from "@neufund/shared-utils";

import { walletEthModuleApi } from "../eth/module";
import { authActions } from "./actions";

function* createNewUser(): Generator<unknown, void> {
  yield* call(authModuleAPI.sagas.createJwt, []);

  const walletMetadata = {
    walletType: EWalletType.MOBILE,
    walletSubType: EWalletSubType.NEUFUND,
  };

  yield* call(authModuleAPI.sagas.loadOrCreateUser, {
    walletMetadata,
    userType: EUserType.INVESTOR,
  });
}

export function* trySignInExistingAccount(): Generator<any, void, any> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const hasExistingWallet = yield* call(() => ethManager.hasExistingWallet());

  if (!hasExistingWallet) {
    logger.info("No existing wallet to sign in");

    return;
  }

  yield put(authActions.signIn());

  yield* call(() => ethManager.plugExistingWallet());

  const jwt = yield neuCall(authModuleAPI.sagas.loadJwt);
  // if JWT is already in the store and it's won't expire soon
  // then just feed state with the current jwt
  if (jwt && isJwtExpiringLateEnough(jwt)) {
    yield neuCall(authModuleAPI.sagas.setJwt, jwt);
  } else {
    yield* call(authModuleAPI.sagas.createJwt, []);
  }

  yield* call(authModuleAPI.sagas.loadUser);

  yield put(authActions.signed());
}

function* createNewAccount(): Generator<unknown, void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield* call(() => ethManager.plugNewRandomWallet());

    yield* call(createNewUser);

    yield put(authActions.signed());
  } catch (e) {
    yield put(authActions.failedToCreateNewAccount());

    logger.error("New account creation failed", e);
  }
}

function* logout(): Generator<unknown, void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    logger.info("Logging out user");

    yield* call(authModuleAPI.sagas.resetUser);

    yield* call(() => ethManager.unsafeDeleteWallet());
  } catch (e) {
    logger.error("Failed to logout user", e);

    // TODO: Force to cleanup keychain state to not store any kind of user data even in case of error
  }
}

export function* authSaga(): Generator<unknown, void> {
  yield fork(neuTakeLatest, authActions.createNewAccount, createNewAccount);
  yield fork(neuTakeLatest, authActions.logout, logout);
}
