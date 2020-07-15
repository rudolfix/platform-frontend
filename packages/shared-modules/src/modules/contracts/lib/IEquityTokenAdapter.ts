import { BigNumber } from "bignumber.js";

import { ISnapshotableTokenAdapter } from "./ISnapshotableTokenAdapter";

/**
 * An adapter interface for ERC 20 Tokens contracts.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IEquityTokenAdapter extends ISnapshotableTokenAdapter {
  tokensPerShare: Promise<BigNumber>;
  tokenController: Promise<string>;
  shareNominalValueUlps: Promise<BigNumber>;
  decimals: Promise<BigNumber>;
}

export { IEquityTokenAdapter };
