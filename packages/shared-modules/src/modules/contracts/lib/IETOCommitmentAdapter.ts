import { BigNumber } from "bignumber.js";

import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for the ETO Commitment.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IETOCommitmentAdapter extends IBasicContractAdapter {
  timedState: Promise<BigNumber>;
  startOfStates: Promise<BigNumber[]>;
  totalInvestment(): Promise<[BigNumber, BigNumber, BigNumber]>;
  equityToken: Promise<string>;
  etoTerms: Promise<string>;
  signedInvestmentAgreementUrl: Promise<string>;
  investorTicket(
    investor: BigNumber | string,
  ): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      boolean,
      boolean,
    ]
  >;
  contributionSummary(): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  >;
  calculateContribution(
    investor: BigNumber | string,
    fromIcbmWallet: boolean,
    newInvestorContributionEurUlps: BigNumber | number,
  ): Promise<[boolean, boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]>;
}

export { IETOCommitmentAdapter };
