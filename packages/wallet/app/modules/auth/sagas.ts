import {
  takeLeading,
  put,
  call,
  neuCall,
  SagaGenerator,
  TActionFromCreator,
  take,
  select,
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

import { EAuthState } from "modules/auth/reducer";
import { selectAuthState } from "modules/auth/selectors";
import { walletEthModuleApi, EWalletExistenceStatus } from "modules/eth/module";
import { notificationUIModuleApi } from "modules/notification-ui/module";

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

      switch (Config.NF_ACCOUNT_UNLOCK_FLOW) {
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
      logger.warn("Wallet lost. Cleaning up the state from metadata");

      const walletMetadata = yield* call([ethManager, "getExistingWalletMetadata"]);

      // do not allow to unlock existing account without having existing wallet
      invariant(walletMetadata, "No existing wallet to sign in");

      yield put(authActions.lost(walletMetadata));

      return;
    }
    default:
      assertNever(existenceStatus, "Invalid wallet existence status");
  }
}

function* allowToUnlockExistingAccount(): SagaGenerator<void> {
  const { ethManager } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
  });

  const walletMetadata = yield* call(() => ethManager.getExistingWalletMetadata());

  // do not allow to unlock existing account without having existing wallet
  invariant(walletMetadata, "No existing wallet to sign in");

  yield put(authActions.canUnlockAccount(walletMetadata));
}

function* signInExistingAccount(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const walletMetadata = yield* call(() => ethManager.getExistingWalletMetadata());

    // do not allow to start sign in without having existing wallet
    invariant(walletMetadata, "No existing wallet to sign in");

    const jwt = yield* neuCall(authModuleAPI.sagas.loadJwt);

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

      yield* call(() => ethManager.plugExistingWallet());
      yield* neuCall(authModuleAPI.sagas.setJwt, jwt);
    } else {
      yield* call(() => ethManager.plugExistingWallet());
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

function* ensureNoLostWallet(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const authState = yield* select(selectAuthState);

  if (authState === EAuthState.LOST) {
    logger.info("Removing lost wallet metadata");

    yield* call([ethManager, "unsafeDeleteLostWallet"]);
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

    yield* call(() => ethManager.plugNewRandomWallet());

    logger.info("Generating new JWT token");

    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating new user");

    yield* call(loadOrCreateUser);

    const walletMetadata = yield* call(() => ethManager.getExistingWalletMetadata());
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

    const hasExistingWallet = yield* call(() => ethManager.hasExistingWallet());

    if (hasExistingWallet) {
      logger.info("Clearing existing wallet from storage");
      yield* call(() => ethManager.unsafeDeleteWallet());
    }

    const importPhraseType = parseImportPhrase(privateKeyOrMnemonic);

    logger.info(`Plugging new wallet from ${importPhraseType}`);

    switch (importPhraseType) {
      case EImportPhrase.PRIVATE_KEY:
        yield* call(() =>
          ethManager.plugNewWalletFromPrivateKey(toEthereumPrivateKey(privateKeyOrMnemonic), name),
        );
        break;

      case EImportPhrase.MNEMONICS:
        yield* call(() =>
          ethManager.plugNewWalletFromMnemonic(toEthereumHDMnemonic(privateKeyOrMnemonic), name),
        );
        break;

      default:
        throw new InvalidImportPhraseError();
    }

    logger.info("Generating new JWT token");
    yield* call(authModuleAPI.sagas.createJwt, []);

    logger.info("Creating or loading new user");
    yield* call(loadOrCreateUser);

    const walletMetadata = yield* call(() => ethManager.getExistingWalletMetadata());
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

  yield put(authActions.logout());
  yield* take(authActions.logoutDone);

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
    yield* call(() => ethManager.unsafeDeleteWallet());

    yield put(authActions.logoutDone());
  } catch (e) {
    logger.error(e, "Failed to logout user");

    yield* call([ethManager, "unsafeDeleteLostWallet"]);

    logger.info("State cleared from the lost wallet");
  }
}

export function* authSaga(): SagaGenerator<void> {
  yield takeLeading(authActions.createAccount, createNewAccount);
  yield takeLeading(authActions.importAccount, importNewAccount);
  yield takeLeading(authActions.switchAccount, switchAccount);
  yield takeLeading(authActions.unlockAccount, signInExistingAccount);
  yield takeLeading(authActions.logout, logout);
}
