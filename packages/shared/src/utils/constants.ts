import BigNumber from "bignumber.js";

import { minutesToMs } from "./DateUtils";

export const AUTH_TOKEN_REFRESH_THRESHOLD = minutesToMs(1);

/**
 * Platform Constants
 */

export const PLATFORM_UNLOCK_FEE = 0.1;
export const PLATFORM_ZERO_FEE = 0;
/**
 * We assume common digits for all currencies on our platform.
 */
export const ETH_DECIMALS = 18;
export const EURO_DECIMALS = 0;

export const DEFAULT_DECIMAL_PLACES = 4;

/**
 * Constants for permissions
 */

export enum EJwtPermissions {
  SUBMIT_KYC_PERMISSION = "submit-kyc",
  CHANGE_EMAIL_PERMISSION = "change-email",
  SUBMIT_ETO_PERMISSION = "submit-eto-listing",
  UPLOAD_IMMUTABLE_DOCUMENT = "upload-issuer-immutable-document",
  DO_BOOK_BUILDING = "do-bookbuilding",
  SIGN_TOS = "sign-tos",
  ISSUER_UPDATE_NOMINEE_REQUEST = "update-nominee-request",
  ISSUER_REMOVE_NOMINEE = "issuer-remove-nominee",
}

/**
 * Useful for money related calculations
 */
export const Q18 = new BigNumber("10").pow(ETH_DECIMALS);

/**
 * Represent zero address on Ethereum - non existing address used by ERC20 to mark minting and burning
 */
export const ETHEREUM_ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Ethereum Address related constants
 */

export const ETHEREUM_ADDRESS_LENGTH = 40;

/*
 * ETO REGISTRATION CONSTANTS
 */

export const MIN_COMPANY_SHARE_CAPITAL = 100;
export const MIN_NEW_SHARE_NOMINAL_VALUE = 1;
export const MIN_PRE_MONEY_VALUATION_EUR = 100000;
export const MIN_EXISTING_SHARE_CAPITAL = 1;
export const MIN_NEW_SHARES_TO_ISSUE = 1;
export const NEW_SHARES_TO_ISSUE_IN_WHITELIST = 1;
export const NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS = 1;
export const COMPANY_TAGS_LIMIT = 6;
export const DAY = 24 * 60 * 60;
export const MAX_PERCENTAGE = 100;
export const MIN_VOTING_DURATION = 7;
export const MAX_VOTING_DURATION = 30;
export const MIN_RESTRICTED_ACT_VOTING_DURATION = 10;
export const MAX_RESTRICTED_ACT_VOTING_DURATION = 30;
export const MIN_VOTING_FINALIZATION_DURATION = 5;
export const MAX_VOTING_FINALIZATION_DURATION = 14;
export const MIN_VOTING_MAJORITY_FRACTION = 0.5;
export const MAX_VOTING_MAJORITY_FRACTION = 0.99;
export const MIN_VOTING_QUORUM = 0.01;
export const MAX_VOTING_QUORUM = 1;
export const ADVISORY_BOARD_TEXT_MIN_LENGTH = 1;

/*
 * Storage Listener Constants
 */

export const IPFS_PROTOCOL = "ipfs";

/* WEB3 Related Constants */
export const BLOCK_MINING_TIME_DELAY = 12000;

export enum EUSState {
  ALABAMA = "AL",
  ALASKA = "AK",
  AMERICAN_SAMOA = "AS",
  ARIZONA = "AZ",
  ARKANSAS = "AR",
  CALIFORNIA = "CA",
  COLORADO = "CO",
  CONNECTICUT = "CT",
  DELAWARE = "DE",
  DISTRICT_OF_COLUMBIA = "DC",
  FEDERATED_STATES_OF_MICRONESIA = "FM",
  FLORIDA = "FL",
  GEORGIA = "GA",
  GUAM = "GU",
  HAWAII = "HI",
  IDAHO = "ID",
  ILLINOIS = "IL",
  INDIANA = "IN",
  IOWA = "IA",
  KANSAS = "KS",
  KENTUCKY = "KY",
  LOUISIANA = "LA",
  MAINE = "ME",
  MARSHALL_ISLANDS = "MH",
  MARYLAND = "MD",
  MASSACHUSETTS = "MA",
  MICHIGAN = "MI",
  MINNESOTA = "MN",
  MISSISSIPPI = "MS",
  MISSOURI = "MO",
  MONTANA = "MT",
  NEBRASKA = "NE",
  NEVADA = "NV",
  NEW_HAMPSHIRE = "NH",
  NEW_JERSEY = "NJ",
  NEW_MEXICO = "NM",
  NEW_YORK = "NY",
  NORTH_CAROLINA = "NC",
  NORTH_DAKOTA = "ND",
  NORTHERN_MARIANA_ISLANDS = "MP",
  OHIO = "OH",
  OKLAHOMA = "OK",
  OREGON = "OR",
  PALAU = "PW",
  PENNSYLVANIA = "PA",
  PUERTO_RICO = "PR",
  RHODE_ISLAND = "RI",
  SOUTH_CAROLINA = "SC",
  SOUTH_DAKOTA = "SD",
  TENNESSEE = "TN",
  TEXAS = "TX",
  UTAH = "UT",
  VERMONT = "VT",
  VIRGIN_ISLANDS = "VI",
  VIRGINIA = "VA",
  WASHINGTON = "WA",
  WEST_VIRGINIA = "WV",
  WISCONSIN = "WI",
  WYOMING = "WY",
}

/**
 * NEUR is only allowed (by legal) for a couple of US states
 * For now we need to disable NEUR for all US states
 */
export const NEUR_ALLOWED_US_STATES: EUSState[] = [];
