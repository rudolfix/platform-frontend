import { call, put, SagaGenerator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";

import { biometricsActions } from "modules/biometry/actions";
import { privateSymbols } from "modules/biometry/lib/symbols";
import { BIOMETRY_NONE } from "modules/biometry/types";

export function* initializeBiometrics(): SagaGenerator<void> {
  const { logger, biometry } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    biometry: privateSymbols.biometry,
  });

  const supportedBiometrics = yield* call([biometry, "getSupportedBiometrics"]);

  if (supportedBiometrics === BIOMETRY_NONE) {
    logger.info("No biometrics support");

    const availableBiometrics = yield* call([biometry, "getAvailableBiometrics"]);

    yield put(biometricsActions.noBiometricsSupport(availableBiometrics));

    return;
  }

  const hasBiometryPermissions = yield* call([biometry, "hasBiometricsPermissions"]);

  if (!hasBiometryPermissions) {
    logger.info("No biometrics permissions");

    yield put(biometricsActions.noBiometricsAccess(supportedBiometrics));

    return;
  }

  yield put(biometricsActions.biometricsAccessAllowed(supportedBiometrics));
}
