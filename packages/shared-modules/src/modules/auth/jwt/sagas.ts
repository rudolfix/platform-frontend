import {
  call,
  neuCall,
  put,
  SagaGenerator,
  select,
  takeEvery,
  takeLatestUntil,
} from "@neufund/sagas";
import {
  calculateTimeLeft,
  EDelayTiming,
  getJwtExpiryDate,
  safeDelay,
} from "@neufund/shared-utils";

import { neuGetBindings } from "../../../utils";
import { coreModuleApi } from "../../core/module";
import { ICreateJwtEndpointResponse } from "../lib/signature/SignatureAuthApi";
import { privateSymbols, symbols } from "../lib/symbols";
import { userPrivateActions } from "../user/actions";
import { jwtActions } from "./actions";
import { JwtNotAvailable } from "./errors";
import { signChallenge } from "./sagasInternal";
import { selectJwt } from "./selectors";
import { EJwtPermissions } from "./types";

type TGlobalDependencies = unknown;

/**
 * Load to store jwt from browser storage
 */
function* loadJwt(): SagaGenerator<string | undefined> {
  const { jwtStorage } = yield* neuGetBindings({
    jwtStorage: symbols.jwtStorage,
  });

  return yield* call(() => jwtStorage.get());
}

/**
 * Save jwt to the browser storage and update the store
 */
function* setJwt(_: TGlobalDependencies, jwt: string): SagaGenerator<void> {
  const { jwtStorage } = yield* neuGetBindings({
    jwtStorage: symbols.jwtStorage,
  });

  yield* call(() => jwtStorage.set(jwt));

  yield put(jwtActions.setJWT(jwt));
}

function* createJwt(
  _: TGlobalDependencies,
  permissions: EJwtPermissions[] = [],
): SagaGenerator<void> {
  const { logger, signatureAuthApi } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    signatureAuthApi: symbols.signatureAuthApi,
  });

  logger.info("Creating jwt");

  const { signedChallenge, challenge, signerType } = yield* call(signChallenge, permissions);

  logger.info("Sending signed challenge back to api");

  const { jwt } = yield* call(() =>
    signatureAuthApi.createJwt(challenge, signedChallenge, signerType),
  );

  yield* neuCall(setJwt, jwt);

  logger.info("Jwt created successfully");
}

/**
 * Escalate JWT with the authentication server.
 * Used to add additional permissions to existing JWT
 */
function* escalateJwt(
  _: TGlobalDependencies,
  permissions: EJwtPermissions[] = [],
): SagaGenerator<void> {
  const { logger, signatureAuthApi } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    signatureAuthApi: symbols.signatureAuthApi,
  });

  const currentJwt = yield* select(selectJwt);
  if (!currentJwt) {
    throw new JwtNotAvailable();
  }

  logger.info("Escalating jwt");

  const { signedChallenge, challenge, signerType } = yield* call(signChallenge, permissions);

  logger.info("Sending signed challenge back to api");

  const { jwt }: ICreateJwtEndpointResponse = yield* call(() =>
    signatureAuthApi.escalateJwt(challenge, signedChallenge, signerType),
  );

  yield* neuCall(setJwt, jwt);

  logger.info("Jwt escalated successfully");
}

/**
 * Refresh JWT with new default expire date.
 * Permissions expire dates left untouched.
 */
function* refreshJWT(): SagaGenerator<void> {
  const { logger, signatureAuthApi } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    signatureAuthApi: symbols.signatureAuthApi,
  });

  logger.info("Refreshing jwt");

  const { jwt }: ICreateJwtEndpointResponse = yield* call(() => signatureAuthApi.refreshJwt());

  yield* neuCall(setJwt, jwt);

  logger.info("Jwt refreshed successfully");
}

function* clearJWT(): SagaGenerator<void> {
  const { jwtStorage } = yield* neuGetBindings({
    jwtStorage: symbols.jwtStorage,
  });

  yield* call(() => jwtStorage.clear());
}

/**
 * Refresh jwt before timing out.
 * In case it's not possible will log out user.
 */
export function* handleJwtTimeout(): SagaGenerator<void> {
  const { logger, jwtTimingThreshold, jwtRefreshThreshold } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
    jwtTimingThreshold: privateSymbols.jwtTimingThreshold,
    jwtRefreshThreshold: privateSymbols.jwtRefreshThreshold,
  });

  try {
    if (jwtTimingThreshold > jwtRefreshThreshold) {
      throw new Error("Timing threshold should be smaller than token refresh threshold");
    }

    const jwt = yield* select(selectJwt);

    if (!jwt) {
      throw new JwtNotAvailable();
    }

    const expiryDate = getJwtExpiryDate(jwt);

    const timeLeft = calculateTimeLeft(expiryDate, true, "milliseconds");

    const timeLeftWithThreshold =
      timeLeft >= jwtRefreshThreshold ? timeLeft - jwtRefreshThreshold : timeLeft;

    const timing = yield* call(safeDelay, timeLeftWithThreshold, {
      threshold: jwtTimingThreshold,
    });

    // If timing matches exact refresh jwt
    // in case timeout was delayed (for e.g. hibernation), logout with session timeout message
    switch (timing) {
      case EDelayTiming.EXACT:
        yield* call(refreshJWT);
        break;
      case EDelayTiming.DELAYED:
        yield put(jwtActions.jwtTimeout());
        break;
    }
  } catch (e) {
    logger.error(e, "Failed to handle jwt timeout");

    // at that moment all request gonna fail therefore we should fallback to critical error UI
    throw e;
  }
}

function* authJwtSagas(): SagaGenerator<void> {
  yield takeEvery(userPrivateActions.reset, clearJWT);
  yield* takeLatestUntil(jwtActions.setJWT, userPrivateActions.reset, handleJwtTimeout);
}

export { createJwt, escalateJwt, refreshJWT, loadJwt, selectJwt, setJwt, authJwtSagas };
