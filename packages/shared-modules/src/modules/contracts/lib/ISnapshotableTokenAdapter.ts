import { BigNumber } from "bignumber.js";

import { IERC20TokenAdapter } from "./IERC20TokenAdapter";

/**
 * An adapter interface for ERC 20 Tokens contracts.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface ISnapshotableTokenAdapter extends IERC20TokenAdapter {
  currentSnapshotId: Promise<BigNumber>;
}

export { ISnapshotableTokenAdapter };
