import BigNumber from "bignumber.js";
import { invariant } from "./invariant";

export function formatMoney(
  value: string,
  currencyDecimals: number,
  decimalPlaces: number,
): string {
  const money = new BigNumber(value);
  const moneyInPrimaryBase = money.div(new BigNumber(10).pow(currencyDecimals));
  return moneyInPrimaryBase.toFixed(decimalPlaces, BigNumber.ROUND_HALF_UP);
}

/**
 * Assumes dot as decimal separator
 */
export function formatThousands(value: string): string {
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return formattedBeforeDot + "." + splitByDot[1];
  }
  return formattedBeforeDot;
}
