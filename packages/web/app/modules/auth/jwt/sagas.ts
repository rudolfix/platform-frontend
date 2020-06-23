import { call, fork, put, select } from "@neufund/sagas";
import { authModuleAPI, EJwtPermissions } from "@neufund/shared-modules";
import {
  EDelayTiming,
  getJwtExpiryDate,
  hasValidPermissions,
  safeDelay,
} from "@neufund/shared-utils";

import { calculateTimeLeft } from "../../../components/shared/utils";
import { TMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { accessWalletAndRunEffect } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { neuCall, neuTakeLatestUntil } from "../../sagasUtils";
import { AUTH_JWT_TIMING_THRESHOLD, AUTH_TOKEN_REFRESH_THRESHOLD } from "../constants";
import { JwtNotAvailable, MessageSignCancelledError } from "../errors";

/**
 * Saga to ensure all the needed permissions are present and still valid on the current jwt
 * If needed permissions are not present/valid will escalate permissions with authentication server
 */
export function* ensurePermissionsArePresentAndRunEffect(
  deps: TGlobalDependencies,
  effect: Generator<any, any, any>,
  permissions: Array<EJwtPermissions> = [],
  title: TMessage,
  message?: TMessage,
  inputLabel?: TMessage,
): Generator<any, any, any> {
  const jwt: string = yield select(authModuleAPI.selectors.selectJwt);

  // check whether all permissions are present and still valid
  if (jwt && hasValidPermissions(jwt, permissions)) {
    yield effect;

    return;
  }

  // obtain a freshly signed token with missing permissions
  try {
    const obtainJwtEffect = neuCall(authModuleAPI.sagas.escalateJwt, permissions);
    yield call(accessWalletAndRunEffect, obtainJwtEffect, title, message, inputLabel);
    yield effect;
  } catch (error) {
    if (error instanceof MessageSignCancelledError) {
      deps.logger.info("Signing Cancelled");
    } else {
      throw error;
    }
  }
}

/**
 * Refresh jwt before timing out.
 * In case it's not possible will log out user.
 */
export function* handleJwtTimeout({ logger }: TGlobalDependencies): Generator<any, any, any> {
  try {
    const jwt: string | undefined = yield select(authModuleAPI.selectors.selectJwt);

    if (!jwt) {
      throw new JwtNotAvailable();
    }

    const expiryDate = getJwtExpiryDate(jwt);

    const timeLeft = calculateTimeLeft(expiryDate, true, "milliseconds");

    const timeLeftWithThreshold =
      timeLeft >= AUTH_TOKEN_REFRESH_THRESHOLD ? timeLeft - AUTH_TOKEN_REFRESH_THRESHOLD : timeLeft;

    if (AUTH_JWT_TIMING_THRESHOLD > AUTH_TOKEN_REFRESH_THRESHOLD) {
      throw new Error("Timing threshold should be smaller than token refresh threshold");
    }

    const timing: EDelayTiming = yield safeDelay(timeLeftWithThreshold, {
      threshold: AUTH_JWT_TIMING_THRESHOLD,
    });

    // If timing matches exact refresh jwt
    // in case timeout was delayed (for e.g. hibernation), logout with session timeout message
    switch (timing) {
      case EDelayTiming.EXACT:
        yield neuCall(authModuleAPI.sagas.refreshJWT);
        break;
      case EDelayTiming.DELAYED:
        yield put(actions.auth.jwtTimeout());
        break;
    }
  } catch (e) {
    logger.error(e, "Failed to handle jwt timeout");
    throw e;
  }
}

export function* authJwtSagas(): Generator<any, any, any> {
  yield fork(
    neuTakeLatestUntil,
    authModuleAPI.actions.setJWT,
    authModuleAPI.actions.stopJwtExpirationWatcher,
    handleJwtTimeout,
  );
}
