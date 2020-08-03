import { BigNumber } from "bignumber.js";

import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for the ETO Commitment.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface ITokenControllerAdapter extends IBasicContractAdapter {
  onTransfer(
    broker: BigNumber | string,
    from: BigNumber | string,
    to: BigNumber | string,
    amount: BigNumber | number,
  ): Promise<boolean>;
}

export { ITokenControllerAdapter };
