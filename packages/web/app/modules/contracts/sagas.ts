import { all, call, put, SagaGenerator } from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { neuCall } from "../sagasUtils";
import { IPlatformTermsConstants } from "./reducer";

export function* initializeContracts({
  contractsService,
}: TGlobalDependencies): SagaGenerator<void> {
  yield* call(() => contractsService.init());

  yield* neuCall(populatePlatformTermsConstants);
}

function* populatePlatformTermsConstants({
  contractsService,
}: TGlobalDependencies): SagaGenerator<void> {
  const contract = contractsService.platformTerms;

  // These are constants from Universe contract no need for polling
  const terms = yield* all({
    IS_ICBM_INVESTOR_WHITELISTED: contract.IS_ICBM_INVESTOR_WHITELISTED,
    PLATFORM_NEUMARK_SHARE: contract.PLATFORM_NEUMARK_SHARE,
    TOKEN_PARTICIPATION_FEE_FRACTION: contract.TOKEN_PARTICIPATION_FEE_FRACTION,
    PLATFORM_FEE_FRACTION: contract.PLATFORM_FEE_FRACTION,
    TOKEN_RATE_EXPIRES_AFTER: contract.TOKEN_RATE_EXPIRES_AFTER,
  });

  // Given that typed-redux-saga won't resolve proper types for promises that's why we need to force cast
  yield put(actions.contracts.setPlatformTermConstants(terms as IPlatformTermsConstants));
}
