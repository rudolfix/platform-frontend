import { call, select } from "@neufund/sagas";
import { authModuleAPI, EJwtPermissions } from "@neufund/shared-modules";
import { hasValidPermissions } from "@neufund/shared-utils";

import { TMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { accessWalletAndRunEffect } from "../../access-wallet/sagas";
import { neuCall } from "../../sagasUtils";
import { MessageSignCancelledError } from "../errors";

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
