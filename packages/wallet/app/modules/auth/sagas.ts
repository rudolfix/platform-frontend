import { takeLeading, put, call, neuCall, SagaGenerator, TActionFromCreator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, authModuleAPI } from "@neufund/shared-modules";
import {
  isJwtExpiringLateEnough,
  toEthereumPrivateKey,
  toEthereumHDMnemonic,
} from "@neufund/shared";

import { walletEthModuleApi } from "../eth/module";
import { notificationUIModuleApi } from "../notification-ui/module";
import { authActions } from "./actions";
import { InvalidImportPhraseError } from "./errors";
import { loadOrCreateUser } from "./sagasInternal";
import { EImportPhrase } from "./types";
import { parseImportPhrase } from "./utils";

export function* trySignInExistingAccount(): SagaGenerator<void> {
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

  const jwt = yield* neuCall(authModuleAPI.sagas.loadJwt);
  // if JWT is already in the store and it's won't expire soon
  // then just feed state with the current jwt
  if (jwt && isJwtExpiringLateEnough(jwt)) {
    yield* neuCall(authModuleAPI.sagas.setJwt, jwt);
  } else {
    yield* call(authModuleAPI.sagas.createJwt, []);
  }

  // given that user may already exist just load the user from database
  yield* call(loadOrCreateUser);

  yield put(authActions.signed());
}

function* createNewAccount(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    logger.info("Plugging random wallet");

    yield* call(() => ethManager.plugNewRandomWallet());

    logger.info("Generating new JWT token");

    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating new user");

    yield* call(loadOrCreateUser);

    yield put(authActions.signed());

    logger.info("New account created");
  } catch (e) {
    yield put(authActions.failedToCreateNewAccount());

    yield put(
      notificationUIModuleApi.actions.showError(
        "New account wasn't created. If issue persist please contact support center.",
      ),
    );

    logger.error("New account creation failed", e);
  }
}

function* importNewAccount(
  action: TActionFromCreator<typeof authActions, typeof authActions.importNewAccount>,
): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const privateKeyOrMnemonic = action.payload.privateKeyOrMnemonic;
    const importPhraseType = parseImportPhrase(privateKeyOrMnemonic);

    logger.info(`Plugging new wallet from ${importPhraseType}`);

    switch (importPhraseType) {
      case EImportPhrase.PRIVATE_KEY:
        yield* call(() =>
          ethManager.plugNewWalletFromPrivateKey(toEthereumPrivateKey(privateKeyOrMnemonic)),
        );

        break;
      case EImportPhrase.MNEMONICS:
        yield* call(() =>
          ethManager.plugNewWalletFromMnemonic(toEthereumHDMnemonic(privateKeyOrMnemonic)),
        );

        break;
      default:
        throw new InvalidImportPhraseError();
    }

    logger.info("Generating new JWT token");

    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating or loading new user");

    yield* call(loadOrCreateUser);

    yield put(authActions.signed());

    logger.info("New account imported");
  } catch (e) {
    yield put(authActions.failedToImportNewAccount());

    yield put(
      notificationUIModuleApi.actions.showError(
        "New account wasn't imported. If issue persist please contact support center.",
      ),
    );

    logger.error("Import account creation failed", e);
  }
}

function* logout(): SagaGenerator<void> {
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
  yield* takeLeading(authActions.createNewAccount, createNewAccount);
  yield* takeLeading(authActions.importNewAccount, importNewAccount);
  yield* takeLeading(authActions.logout, logout);
}
