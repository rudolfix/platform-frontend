import {
  takeLeading,
  put,
  call,
  neuCall,
  SagaGenerator,
  TActionFromCreator,
  take,
} from "@neufund/sagas";
import { coreModuleApi, neuGetBindings, authModuleAPI } from "@neufund/shared-modules";
import {
  isJwtExpiringLateEnough,
  toEthereumPrivateKey,
  toEthereumHDMnemonic,
  invariant,
  assertNever,
} from "@neufund/shared-utils";
import Config from "react-native-config";

import { walletEthModuleApi, EWalletExistenceStatus } from "modules/eth/module";
import { notificationUIModuleApi } from "modules/notification-ui/module";

import { authActions } from "./actions";
import { InvalidImportPhraseError } from "./errors";
import {
  allowToUnlockExistingAccount,
  loadOrCreateUser,
  ensureNoLostWallet,
} from "./sagasInternal";
import { EImportPhrase } from "./types";
import { parseImportPhrase } from "./utils";

export function* trySignInExistingAccount(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const existenceStatus = yield* call(() => ethManager.getWalletExistenceStatus());

  switch (existenceStatus) {
    case EWalletExistenceStatus.NOT_EXIST: {
      logger.info("No existing wallet to sign in");

      yield put(authActions.canCreateAccount());

      return;
    }
    case EWalletExistenceStatus.EXIST: {
      const unlockFlow = Config.NF_ACCOUNT_UNLOCK_FLOW ?? "auto";

      logger.info(`Unlock flow set to ${unlockFlow}`);

      switch (unlockFlow) {
        case "user_requested":
          yield* call(allowToUnlockExistingAccount);
          break;

        case "auto":
        default:
          yield* call(signInExistingAccount);
          break;
      }

      return;
    }
    case EWalletExistenceStatus.LOST: {
      logger.warn("Wallet lost");

      const walletMetadata = yield* call([ethManager, "getExistingWalletMetadata"]);

      invariant(walletMetadata, "Wallet metadata should be present in case of account was lost");

      yield put(authActions.accountLost(walletMetadata));

      return;
    }
    default:
      assertNever(existenceStatus, "Invalid wallet existence status");
  }
}

function* signInExistingAccount(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const walletMetadata = yield* call([ethManager, "getExistingWalletMetadata"]);

    // do not allow to start sign in without having existing wallet
    invariant(walletMetadata, "No existing wallet to sign in");

    const jwt = yield* call(authModuleAPI.sagas.loadJwt);

    // if JWT is already in the store and it's won't expire soon
    // then just feed state with the current jwt
    if (jwt && isJwtExpiringLateEnough(jwt)) {
      // given we reuse jwt we need to confirm user has access to secure enclave
      const hasValidCredentials = yield* call([ethManager, "hasValidCredentials"]);

      if (!hasValidCredentials) {
        logger.info("Not valid credentials");

        yield put(authActions.failedToUnlockAccount());

        return;
      }

      yield* call([ethManager, "plugExistingWallet"]);
      yield* call(authModuleAPI.sagas.setJwt, {}, jwt);
    } else {
      yield* call([ethManager, "plugExistingWallet"]);
      yield* call(authModuleAPI.sagas.createJwt, []);
    }

    // given that user may already exist just load the user from database
    yield* call(loadOrCreateUser);

    yield put(authActions.unlockAccountDone(walletMetadata));
  } catch (e) {
    logger.error(e, "Failed to unlock account");

    yield put(authActions.failedToUnlockAccount());
  }
}

function* lockAccount(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    logger.info("Locking account");

    // keep to store so JWT can be reused if not expired
    yield* call(authModuleAPI.sagas.resetUser, { clearStorage: false });

    yield put(authActions.lockAccountDone());
  } catch (e) {
    logger.error(e, "Failed to lock account");

    yield put(authActions.failedToLockAccount());
  }
}

function* createNewAccount(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    yield* call(ensureNoLostWallet);

    logger.info("Plugging random wallet");

    yield* call([ethManager, "plugNewRandomWallet"]);

    logger.info("Generating new JWT token");

    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating new user");

    yield* call(loadOrCreateUser);

    const walletMetadata = yield* call([ethManager, "getExistingWalletMetadata"]);
    // do not allow to start sign in without having existing wallet
    invariant(walletMetadata, "No existing wallet to sign in");

    yield put(authActions.unlockAccountDone(walletMetadata));

    logger.info("New account created");
  } catch (e) {
    yield put(authActions.failedToCreateAccount());

    yield put(
      notificationUIModuleApi.actions.showError(
        "New account wasn't created. If this issue persists, please contact support center.",
      ),
    );

    logger.error(e, "New account creation failed");
  }
}

function* importNewAccount(
  action: TActionFromCreator<typeof authActions, typeof authActions.importAccount>,
): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const { privateKeyOrMnemonic, name } = action.payload;

  try {
    yield* call(ensureNoLostWallet);

    const hasExistingWallet = yield* call([ethManager, "hasExistingWallet"]);

    if (hasExistingWallet) {
      logger.info("Clearing existing wallet from storage");
      yield* call([ethManager, "unsafeDeleteWallet"]);
    }

    const importPhraseType = parseImportPhrase(privateKeyOrMnemonic);

    logger.info(`Plugging new wallet from ${importPhraseType}`);

    switch (importPhraseType) {
      case EImportPhrase.PRIVATE_KEY:
        yield* call(
          [ethManager, "plugNewWalletFromPrivateKey"],
          toEthereumPrivateKey(privateKeyOrMnemonic),
          name,
        );
        break;

      case EImportPhrase.MNEMONICS:
        yield* call(
          [ethManager, "plugNewWalletFromMnemonic"],
          toEthereumHDMnemonic(privateKeyOrMnemonic),
          name,
        );

        break;

      default:
        throw new InvalidImportPhraseError();
    }

    logger.info("Generating new JWT token");
    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating or loading new user");
    yield* call(loadOrCreateUser);

    const walletMetadata = yield* call([ethManager, "getExistingWalletMetadata"]);
    // do not allow to start sign in without having existing wallet
    invariant(walletMetadata, "No existing wallet to sign in");

    yield put(authActions.unlockAccountDone(walletMetadata));

    logger.info("New account imported");
  } catch (e) {
    yield put(authActions.failedToImportAccount());

    yield put(
      notificationUIModuleApi.actions.showError(
        "New account wasn't imported. If this issue persists, please contact support center.",
      ),
    );

    logger.error(e, "Import account creation failed");
  }
}

function* switchAccount(
  action: TActionFromCreator<typeof authActions, typeof authActions.switchAccount>,
): SagaGenerator<void> {
  const { privateKeyOrMnemonic, name } = action.payload;

  yield put(authActions.logoutAccount());
  yield* take(authActions.logoutAccountDone);

  yield put(authActions.importAccount(privateKeyOrMnemonic, name));
}

function* logout(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    logger.info("Logging out user");

    yield* call(authModuleAPI.sagas.resetUser);
    yield* call([ethManager, "unsafeDeleteWallet"]);

    yield put(authActions.logoutAccountDone());
  } catch (e) {
    logger.error(e, "Failed to logout user");

    // in case of an error during logout we should cleanup wallet completely
    yield* call([ethManager, "unsafeDeleteLostWallet"]);
    yield put(authActions.logoutAccountDone());

    logger.info("State cleared from the lost wallet");
  }
}

export function* authSaga(): SagaGenerator<void> {
  yield takeLeading(authActions.createAccount, createNewAccount);
  yield takeLeading(authActions.importAccount, importNewAccount);
  yield takeLeading(authActions.switchAccount, switchAccount);
  yield takeLeading(authActions.unlockAccount, signInExistingAccount);
  yield takeLeading(authActions.lockAccount, lockAccount);
  yield takeLeading(authActions.logoutAccount, logout);
}
