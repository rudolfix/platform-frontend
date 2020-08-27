import { call, fork, neuTakeLatest, put, SagaGenerator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { assertNever, invariant, StateNotAllowedError } from "@neufund/shared-utils";

import { biometricsActions } from "modules/biometry/actions";
import { privateSymbols } from "modules/biometry/lib/symbols";
import { BIOMETRY_NONE } from "modules/biometry/types";
import { PERMISSION_RESULTS } from "modules/permissions/module";

export function* initializeBiometrics(): SagaGenerator<void> {
  const { logger, biometry } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    biometry: privateSymbols.biometry,
  });

  const availableBiometrics = yield* call([biometry, "getAvailableBiometrics"]);
  const supportedBiometrics = yield* call([biometry, "getSupportedBiometrics"]);
  const biometryPermission = yield* call([biometry, "getBiometryPermission"]);

  if (supportedBiometrics === BIOMETRY_NONE && biometryPermission !== PERMISSION_RESULTS.BLOCKED) {
    logger.info("No biometrics support");

    yield put(biometricsActions.noBiometricsSupport(availableBiometrics));

    return;
  }

  invariant(availableBiometrics !== BIOMETRY_NONE, "Biometry type should be known at this point");

  switch (biometryPermission) {
    case PERMISSION_RESULTS.DENIED:
      logger.info("Biometrics need to request for permissions");

      yield put(biometricsActions.biometricsAccessRequestRequired(availableBiometrics));

      break;
    case PERMISSION_RESULTS.BLOCKED:
      logger.info("No biometrics permissions");

      yield put(biometricsActions.noBiometricsAccess(availableBiometrics));

      break;
    case PERMISSION_RESULTS.GRANTED:
      yield put(biometricsActions.biometricsAccessAllowed(availableBiometrics));

      break;
    case PERMISSION_RESULTS.UNAVAILABLE:
      throw new StateNotAllowedError("Biometry type should be known at this point");

    default:
      assertNever(biometryPermission);
  }
}

function* requestFaceIdPermissions(): SagaGenerator<void> {
  const { logger, biometry } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    biometry: privateSymbols.biometry,
  });

  logger.info("Requesting face id permissions");

  const requestResult = yield* call([biometry, "requestBiometryPermission"]);

  logger.info(`Face id permission "${requestResult}"`);

  yield* call(initializeBiometrics);
}

export function* biometricsSagas(): SagaGenerator<void> {
  yield fork(neuTakeLatest, biometricsActions.requestFaceIdPermissions, requestFaceIdPermissions);
}
