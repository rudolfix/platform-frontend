import { call, SagaGenerator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { privateSymbols } from "modules/wallet-connect/lib/symbols";
import { connectEvents } from "modules/wallet-connect/sagaFunctions/connectEvents";

export function* tryToConnectExistingSession(): SagaGenerator<void> {
  const { walletConnectManager, logger } = yield* neuGetBindings({
    walletConnectManager: privateSymbols.walletConnectManager,
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const hasExistingSession = yield* call([walletConnectManager, "hasExistingSession"]);

    if (hasExistingSession) {
      logger.info(`Existing wallet connect session found, attempting to use it...`);

      const wcAdapter = yield* call([walletConnectManager, "useExistingSession"]);

      yield* call(connectEvents, wcAdapter);
    } else {
      logger.info(`No existing wallet connect session found, doing nothing.`);
    }
  } catch (e) {
    logger.error(e, `Try to connect existing wallet connect session failed`);
  }
}
