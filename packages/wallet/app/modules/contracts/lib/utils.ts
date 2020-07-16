/**
 * Adapter type conversion helpers
 */
import { BigNumber } from "bignumber.js";
import { utils } from "ethers";

function bnToBne(number: BigNumber): utils.BigNumber {
  return new utils.BigNumber(number.toString());
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
