import { BigNumber } from "bignumber.js";

import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for the ETO terms.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IETOTermsAdapter extends IBasicContractAdapter {
  WHITELIST_DISCOUNT_FRAC: Promise<BigNumber>;
  PUBLIC_DISCOUNT_FRAC: Promise<BigNumber>;

  calculatePriceFraction(priceFrac: BigNumber | number): Promise<BigNumber>;
  whitelistTicket(investor: BigNumber | string): Promise<[boolean, BigNumber, BigNumber]>;
}

export { IETOTermsAdapter };
