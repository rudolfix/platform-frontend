import {
  takeLatest,
  put,
  fork,
  call,
  neuCall,
  SagaGenerator,
  TActionFromCreator,
} from "@neufund/sagas";
import {
  coreModuleApi,
  neuGetBindings,
  authModuleAPI,
  EUserType,
  EWalletType,
  EWalletSubType,
} from "@neufund/shared-modules";
import { isJwtExpiringLateEnough } from "@neufund/shared";

import { walletEthModuleApi } from "../eth/module";
import { authActions } from "./actions";
import { InvalidImportPhraseError } from "./errors";
import { EImportPhrase } from "./types";
import { parseImportPhrase } from "./utils";

function* createNewUser(): SagaGenerator<void> {
  yield* call(authModuleAPI.sagas.createJwt, []);

  yield* call(authModuleAPI.sagas.loadOrCreateUser, {
    userType: EUserType.INVESTOR,
    walletType: EWalletType.MOBILE,
    walletSubType: EWalletSubType.NEUFUND,
  });
}

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

function* createNewAccount(): SagaGenerator<void> {
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

function* importNewAccount(
  action: TActionFromCreator<typeof authActions.importNewAccount, typeof authActions>,
): SagaGenerator<void> {
  debugger;

  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const privateKeyOrMnemonic = action.payload.privateKeyOrMnemonic;
    const importPhraseType = parseImportPhrase(privateKeyOrMnemonic);

    switch (importPhraseType) {
      case EImportPhrase.PRIVATE_KEY:
        yield* call(() => ethManager.plugNewWalletFromPrivateKey(privateKeyOrMnemonic));

        break;
      case EImportPhrase.MNEMONICS:
        yield* call(() => ethManager.plugNewWalletFromMnemonic(privateKeyOrMnemonic));

        break;
      default:
        throw new InvalidImportPhraseError();
    }

    yield* call(createNewUser);

    yield put(authActions.signed());
  } catch (e) {
    yield put(authActions.failedToImportNewAccount());

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
  yield takeLatest(authActions.createNewAccount, createNewAccount);
  yield takeLatest(authActions.importNewAccount, importNewAccount);
  yield takeLatest(authActions.logout, logout);
}
