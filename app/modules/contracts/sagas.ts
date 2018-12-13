import { put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { IPlatformTermsConstants } from "./reducer";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  await contractsService.init();
}

export function* populatePlatformTermsConstants({ contractsService }: TGlobalDependencies): any {
  const contract = contractsService.platformTerms;

  const terms: IPlatformTermsConstants = {
    IS_ICBM_INVESTOR_WHITELISTED: yield contract.IS_ICBM_INVESTOR_WHITELISTED,
    MIN_TICKET_EUR_ULPS: yield contract.MIN_TICKET_EUR_ULPS,
    PLATFORM_NEUMARK_SHARE: yield contract.PLATFORM_NEUMARK_SHARE,
    TOKEN_PARTICIPATION_FEE_FRACTION: yield contract.TOKEN_PARTICIPATION_FEE_FRACTION,
    PLATFORM_FEE_FRACTION: yield contract.PLATFORM_FEE_FRACTION,
    DATE_TO_WHITELIST_MIN_DURATION: yield contract.DATE_TO_WHITELIST_MIN_DURATION,
    TOKEN_RATE_EXPIRES_AFTER: yield contract.TOKEN_RATE_EXPIRES_AFTER,
    MIN_WHITELIST_DURATION: yield contract.MIN_WHITELIST_DURATION,
    MAX_WHITELIST_DURATION: yield contract.MAX_WHITELIST_DURATION,
    MIN_OFFER_DURATION: yield contract.MIN_OFFER_DURATION,
    MAX_OFFER_DURATION: yield contract.MAX_OFFER_DURATION,
    MIN_PUBLIC_DURATION: yield contract.MIN_PUBLIC_DURATION,
    MAX_PUBLIC_DURATION: yield contract.MAX_SIGNING_DURATION,
    MIN_SIGNING_DURATION: yield contract.MIN_SIGNING_DURATION,
    MAX_SIGNING_DURATION: yield contract.MAX_SIGNING_DURATION,
    MIN_CLAIM_DURATION: yield contract.MIN_CLAIM_DURATION,
    MAX_CLAIM_DURATION: yield contract.MAX_CLAIM_DURATION,
  };

  yield put(actions.contracts.setPlatformTermConstants(terms));
}
