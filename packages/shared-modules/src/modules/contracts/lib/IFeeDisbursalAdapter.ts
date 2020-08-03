import { BigNumber } from "bignumber.js";

import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for the Fee Disbursal.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IFeeDisbursalAdapter extends IBasicContractAdapter {
  claimableMutipleByToken(
    tokens: string[],
    proRataToken: BigNumber | string,
    claimer: BigNumber | string,
  ): Promise<BigNumber[][]>;
  getNonClaimableDisbursals(
    token: BigNumber | string,
    proRataToken: BigNumber | string,
  ): Promise<BigNumber[][]>;
}

export { IFeeDisbursalAdapter };
