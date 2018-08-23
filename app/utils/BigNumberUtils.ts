import BigNumber from "bignumber.js";

type NumberRepresentation = string | number | BigNumber

/**
 * Add string as BigNumbers
 */
export const addBigNumbers = (numbers: NumberRepresentation[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => {
      return acc.plus(new BigNumber(number));
    }, new BigNumber(0))
    .toString();

/**
 * Multiply string as BigNumbers
 */
export const multiplyBigNumbers = (numbers: NumberRepresentation[]): string =>
  numbers
    .reduce((acc: BigNumber, number) => {
      return acc.mul(new BigNumber(number));
    }, new BigNumber(1))
    .toString();

/**
 * Divide any number representation as BigNumbers
 */
export const divideBigNumbers = (dividend: NumberRepresentation, divisor: NumberRepresentation): string =>
  new BigNumber(dividend).div(divisor).toString();
