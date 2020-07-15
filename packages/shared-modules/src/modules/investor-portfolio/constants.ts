import { Q18 } from "@neufund/shared-utils";

export const EURO_TOKEN_PAYOUT_THRESHOLD = "1";
export const ETHER_TOKEN_PAYOUT_THRESHOLD = "0.01";

// when calculating minimum ticket, this is defult value for subsequent investments
// in the same ETO
export const MIMIMUM_RETAIL_TICKET_EUR_ULPS = Q18.mul("10");
