import { call, fork, neuTakeLatest, put, SagaGenerator } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import { assertNever, invariant, StateNotAllowedError } from "@neufund/shared-utils";

import { biometricsActions } from "modules/biometrics/actions";
import { privateSymbols } from "modules/biometrics/lib/symbols";
import { BIOMETRICS_NONE, EBiometricsType } from "modules/biometrics/types";
import { PERMISSION_RESULTS } from "modules/permissions/module";

import { EPlatform, Platform } from "utils/Platform";

export function* initializeBiometrics(): SagaGenerator<void> {
  const { logger, biometrics } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    biometrics: privateSymbols.biometrics,
  });

  // TODO Replace with proper logic for Android
  if (Platform.OS === EPlatform.Android) {
    yield put(biometricsActions.biometricsAccessAllowed(EBiometricsType.IOSFaceID));
    return;
  }

  const availableBiometrics = yield* call([biometrics, "getAvailableBiometrics"]);
  const canImplyAuthentication = yield* call([biometrics, "canImplyAuthentication"]);
  const biometryPermission = yield* call([biometrics, "getBiometricsPermission"]);

  if (!canImplyAuthentication && biometryPermission !== PERMISSION_RESULTS.BLOCKED) {
    logger.info("No biometrics support");

    yield put(biometricsActions.noBiometricsSupport(availableBiometrics));

    return;
  }

  invariant(
    availableBiometrics !== BIOMETRICS_NONE,
    "Biometrics type should be known at this point",
  );

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
      throw new StateNotAllowedError("Biometrics type should be known at this point");

    default:
      assertNever(biometryPermission);
  }
}

function* requestPermissions(): SagaGenerator<void> {
  const { logger, biometrics } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    biometrics: privateSymbols.biometrics,
  });

  logger.info("Requesting biometrics permissions");

  const requestResult = yield* call([biometrics, "requestBiometryPermission"]);

  logger.info(`Biometrics permission "${requestResult}"`);

  yield* call(initializeBiometrics);
}

export function* biometricsSagas(): SagaGenerator<void> {
  yield fork(neuTakeLatest, biometricsActions.requestPermissions, requestPermissions);
}
