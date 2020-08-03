import { ECurrency, isValidNumber } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as Yup from "yup";

const VALIDATION_MAX_PLEDGE = "The amount is above the maximum whitelist commitment size.";
const VALIDATION_INTEGER = "Must be a whole number";
const VALIDATION_MIN_PLEDGE = "The amount is below the minimum whitelist commitment size.";

export interface IPledge {
  amountEur: number;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
  etoId?: string;
}

export interface IPledges {
  [etoId: string]: IPledge;
}

export interface IBookBuildingStats {
  investorsCount: number;
  pledgedAmount: number;
}

const isPledgeNotAboveMaximum = (maxPledge?: number): Yup.TestOptions => ({
  name: "minAmount",
  message: VALIDATION_MAX_PLEDGE,
  test: function(this: Yup.TestContext, value: string): boolean {
    return (
      isValidNumber(value) &&
      new BigNumber(value).lessThanOrEqualTo(maxPledge ? maxPledge.toString() : Infinity.toString())
    );
  },
});

const isPledgeAboveMinimum = (minPledge: number): Yup.TestOptions => ({
  name: "minAmount",
  message: VALIDATION_MIN_PLEDGE,
  test: function(this: Yup.TestContext, value: string): boolean {
    return isValidNumber(value) && new BigNumber(value).greaterThanOrEqualTo(minPledge.toString());
  },
});

export const generateCampaigningValidation = (minPledge: number, maxPledge?: number) =>
  Yup.object({
    amount: Yup.string()
      .required()
      .matches(/^[0-9]*$/, VALIDATION_INTEGER)
      .test(isPledgeAboveMinimum(minPledge))
      .test(isPledgeNotAboveMaximum(maxPledge)),
  });
