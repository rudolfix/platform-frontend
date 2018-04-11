import BigNumber from "bignumber.js";

/**
 * Add string as BigNumbers
 */
export const addBigNumbers = (numbers: string[]): string =>
  numbers
    .reduce((acc, number) => {
      return acc.plus(new BigNumber(number));
    }, new BigNumber(0))
    .toString();

/**
 * Multiply string as BigNumbers
 */
export const multiplyBigNumbers = (numbers: string[]): string =>
  numbers
    .reduce((acc, number) => {
      return acc.mul(new BigNumber(number));
    }, new BigNumber(1))
    .toString();
