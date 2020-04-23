import { call, SagaGenerator } from "@neufund/sagas";
import {
  authModuleAPI,
  coreModuleApi,
  EUserType,
  EWalletSubType,
  EWalletType,
  neuGetBindings,
} from "@neufund/shared-modules";

function* loadOrCreateUser(): SagaGenerator<void> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  logger.info("Loading or creating new mobile app user");

  yield* call(authModuleAPI.sagas.loadOrCreateUser, {
    userType: EUserType.INVESTOR,
    walletType: EWalletType.MOBILE,
    walletSubType: EWalletSubType.NEUFUND,
  });
}

export { loadOrCreateUser };
