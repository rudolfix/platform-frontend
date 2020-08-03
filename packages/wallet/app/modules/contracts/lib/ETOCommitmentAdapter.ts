/* eslint-disable @typescript-eslint/no-magic-numbers */

import { IETOCommitmentAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { ETOCommitment } from "lib/contracts/ETOCommitment";
import { ETOCommitmentFactory } from "lib/contracts/ETOCommitmentFactory";

import { converters } from "./utils";

class ETOCommitmentAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IETOCommitmentAdapter {
    return new ETOCommitmentAdapter(ETOCommitmentFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for Eto Commitment to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class ETOCommitmentAdapter implements IETOCommitmentAdapter {
  readonly address: string;

  constructor(private readonly contract: ETOCommitment) {
    this.address = contract.address;
  }

  get timedState(): Promise<BigNumber> {
    return this.contract.timedState().then(converters.nToBn);
  }

  get startOfStates(): Promise<BigNumber[]> {
    return (async () => {
      const result = await this.contract.startOfStates();
      const resultArray: BigNumber[] = [];

      for (let i = 0; i < result.length; i++) {
        resultArray.push(converters.bneToBn(result[i]));
      }
      return resultArray;
    })();
  }

  get equityToken(): Promise<string> {
    return this.contract.equityToken();
  }

  get etoTerms(): Promise<string> {
    return this.contract.etoTerms();
  }

  get signedInvestmentAgreementUrl(): Promise<string> {
    return this.contract.signedInvestmentAgreementUrl();
  }

  async totalInvestment(): Promise<[BigNumber, BigNumber, BigNumber]> {
    const result = await this.contract.totalInvestment();
    return [
      converters.bneToBn(result[0]),
      converters.bneToBn(result[1]),
      converters.bneToBn(result[2]),
    ];
  }

  async investorTicket(
    investor: string,
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
  > {
    const result = await this.contract.investorTicket(investor);
    return [
      converters.bneToBn(result[0]),
      converters.bneToBn(result[1]),
      converters.bneToBn(result[2]),
      converters.bneToBn(result[3]),
      converters.bneToBn(result[4]),
      converters.bneToBn(result[5]),
      converters.bneToBn(result[6]),
      converters.bneToBn(result[7]),
      result[8],
      result[9],
    ];
  }

  async contributionSummary(): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
  > {
    const result = await this.contract.contributionSummary();
    return [
      converters.bneToBn(result[0]),
      converters.bneToBn(result[1]),
      converters.bneToBn(result[2]),
      converters.bneToBn(result[3]),
      converters.bneToBn(result[4]),
      converters.bneToBn(result[5]),
      converters.bneToBn(result[6]),
      converters.bneToBn(result[7]),
    ];
  }

  async calculateContribution(
    investor: string,
    fromIcbmWallet: boolean,
    newInvestorContributionEurUlps: BigNumber,
  ): Promise<[boolean, boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]> {
    const result = await this.contract.calculateContribution(
      investor,
      fromIcbmWallet,
      converters.bnToBne(newInvestorContributionEurUlps),
    );

    return [
      result[0],
      result[1],
      converters.bneToBn(result[2]),
      converters.bneToBn(result[3]),
      converters.bneToBn(result[4]),
      converters.bneToBn(result[5]),
      result[6],
    ];
  }
}

export { ETOCommitmentAdapterFactory };
