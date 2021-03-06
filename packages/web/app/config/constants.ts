import { EUserType } from "@neufund/shared-modules";
import { minutesToMs } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

// If running in cypress wait for a short time
export const LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME =
  process.env.NF_CYPRESS_RUN === "1" ? 1000 * 60 : 1000 * 60 * 3;

/**
 * We assume common digits for all currencies on our platform.
 */
export const DEFAULT_DECIMAL_PLACES = 4;

/**
 * Constants for react components
 */
export const TOAST_COMPONENT_DELAY = 4000;

export const BROWSER_WALLET_RECONNECT_INTERVAL = 1000;
export const NOMINEE_BANK_ACCOUNT_WATCHER_DELAY = 1000 * 60 * 5;
export const PAYOUT_POLLING_DELAY = 1000;
export const USERS_WITH_ACCOUNT_SETUP = [EUserType.NOMINEE, EUserType.INVESTOR];

export const WC_DEFAULT_SESSION_REQUEST_TIMEOUT = minutesToMs(10);
export const WC_DEFAULT_SIGN_TIMEOUT = minutesToMs(10);

// for testing purposes we can change this threshold via .env.
// minimal amount to show the user a high gas cost warning during payout. In Euros
export const MINIMAL_PAYOUT_WITHOUT_WARNING = new BigNumber(
  process.env.NF_MINIMAL_PAYOUT_WITHOUT_WARNING || "2",
);
