import { call, put, SagaGenerator, select } from "@neufund/sagas";
import {
  authModuleAPI,
  coreModuleApi,
  EUserType,
  EWalletSubType,
  EWalletType,
  neuGetBindings,
} from "@neufund/shared-modules";
import { invariant } from "@neufund/shared-utils";

import { authActions } from "modules/auth/actions";
import { selectAuthLostWallet } from "modules/auth/selectors";
import { walletEthModuleApi } from "modules/eth/module";

function* loadOrCreateUser(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  logger.info("Loading or creating new mobile app user");

  const walletMetadata = {
    walletType: EWalletType.MOBILE,
    walletSubType: EWalletSubType.NEUFUND,
  };

  yield* call(authModuleAPI.sagas.loadOrCreateUser, {
    walletMetadata,
    userType: EUserType.INVESTOR,
  });
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

function* ensureNoLostWallet(): SagaGenerator<void> {
  const { ethManager, logger } = yield* neuGetBindings({
    ethManager: walletEthModuleApi.symbols.ethManager,
    logger: coreModuleApi.symbols.logger,
  });

  const lostWallet = yield* select(selectAuthLostWallet);

  if (lostWallet) {
    logger.info("Removing lost wallet metadata");

    yield* call([ethManager, "unsafeDeleteLostWallet"]);
  }
}

export { loadOrCreateUser, allowToUnlockExistingAccount, ensureNoLostWallet };
