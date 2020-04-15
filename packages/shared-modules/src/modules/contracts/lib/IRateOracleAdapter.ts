import { BigNumber } from "bignumber.js";

import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for RateOracle contract.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IRateOracleAdapter extends IBasicContractAdapter {
  getExchangeRates(
    numeratorTokens: string[],
    denominatorTokens: string[],
  ): Promise<[BigNumber[], BigNumber[]]>;
}

export { IRateOracleAdapter };
