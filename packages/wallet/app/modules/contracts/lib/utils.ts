/**
 * Adapter type conversion helpers
 */
import { BigNumber } from "bignumber.js";
import { utils } from "ethers";

function bnToBne(number: BigNumber): utils.BigNumber {
  // note that bn.js do not support scientific notation
  // therefore we need to force decimals in `toString`
  return new utils.BigNumber(number.toString(10));
}

function bneToBn(number: utils.BigNumber): BigNumber {
  return new BigNumber(number.toString());
}

function bneToBnArray2d(input: utils.BigNumber[][]): BigNumber[][] {
  return input.map(bnArray => bnArray.map(bneToBn));
}

function nToBn(input: number): BigNumber {
  return new BigNumber(input.toString());
}

const converters = {
  bnToBne,
  nToBn,
  bneToBn,
  bneToBnArray2d,
};

export { converters };
