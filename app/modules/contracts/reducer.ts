import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

/**
 * Constants from Platform Terms.
 * Mind the units. Durations are in seconds.
 */
export interface IPlatformTermsConstants {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: number;
  PLATFORM_NEUMARK_SHARE: number;
  TOKEN_PARTICIPATION_FEE_FRACTION: number;
  PLATFORM_FEE_FRACTION: number;
  DATE_TO_WHITELIST_MIN_DURATION: number;
  TOKEN_RATE_EXPIRES_AFTER: number;

  MIN_WHITELIST_DURATION: number;
  MAX_WHITELIST_DURATION: number;

  MIN_OFFER_DURATION: number;
  MAX_OFFER_DURATION: number;

  MIN_PUBLIC_DURATION: number;
  MAX_PUBLIC_DURATION: number;

  MIN_SIGNING_DURATION: number;
  MAX_SIGNING_DURATION: number;

  MIN_CLAIM_DURATION: number;
  MAX_CLAIM_DURATION: number;
}

interface IContractState {
  platformTermsConstants: IPlatformTermsConstants;
}

const contractsInitialState: IContractState = {
  platformTermsConstants: {} as any,
  // initially empty. But contract should be initialized first on application start,
  // and values are set throughout the app lifetime
};

export const contractsReducer: AppReducer<IContractState> = (
  state = contractsInitialState,
  action,
): DeepReadonly<IContractState> => {
  switch (action.type) {
    case "CONTRACTS_SET_PLATFORM_TERM_CONSTANTS":
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};
