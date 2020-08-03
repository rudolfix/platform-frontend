import { BigNumber } from "bignumber.js";

import { ETOCommitment } from "../../contracts/ETOCommitment";
import { promisify } from "../../contracts/typechain-runtime";

export class PatchedETOCommitment extends ETOCommitment {
  /**
   * Patched method because of typechain boolean casting bug
   */
  public calculateContribution(
    investor: BigNumber | string,
    fromIcbmWallet: boolean,
    newInvestorContributionEurUlps: BigNumber | number,
  ): Promise<[boolean, boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]> {
    return promisify(this.rawWeb3Contract.calculateContribution, [
      investor,
      fromIcbmWallet,
      newInvestorContributionEurUlps,
    ]);
  }
}
