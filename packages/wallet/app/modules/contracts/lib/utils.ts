/**
 * Adapter type conversion helpers
 */
import { BigNumber } from "bignumber.js";
import { BigNumber as BigNumberEther } from "ethers/utils";

function bnToBne(number: BigNumber): BigNumberEther {
  return new BigNumberEther(number.toString());
}

function bneToBn(number: BigNumberEther): BigNumber {
  return new BigNumber(number.toString());
}

function bneToBnArray2d(input: BigNumberEther[][]): BigNumber[][] {
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
