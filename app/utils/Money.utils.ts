import BigNumber from "bignumber.js";

import { Q18 } from "../config/constants";
import { invariant } from "./invariant";

export function formatMoney(
  value: string | BigNumber,
  currencyDecimals: number,
  decimalPlaces?: number,
): string {
  const money = new BigNumber(value);
  const moneyInPrimaryBase = money.div(new BigNumber(10).pow(currencyDecimals));
  return decimalPlaces !== undefined
    ? moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_UP)
    : moneyInPrimaryBase.toString();
}

/**
 * Assumes dot as decimal separator
 */
export function formatThousands(value?: string): string {
  if (!value) return "";
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return formattedBeforeDot + "." + splitByDot[1];
  }
  return formattedBeforeDot;
}

export function convertToBigInt(value: string, currencyDecimals?: number): string {
  const q = currencyDecimals ? new BigNumber(10).pow(currencyDecimals) : Q18;
  const moneyInWei = q.mul(value);
  return moneyInWei.toFixed(0, BigNumber.ROUND_UP);
}
