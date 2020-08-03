import { IETOTermsAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { ETOTerms } from "lib/contracts/ETOTerms";
import { ETOTermsFactory } from "lib/contracts/ETOTermsFactory";

import { converters } from "./utils";

class ETOTermsAdapterFactory {
  static connect(address: string, signerOrProvider: Signer | providers.Provider): IETOTermsAdapter {
    return new ETOTermsAdapter(ETOTermsFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for Eto Terms to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class ETOTermsAdapter implements IETOTermsAdapter {
  readonly address: string;

  constructor(private readonly contract: ETOTerms) {
    this.address = contract.address;
  }

  get WHITELIST_DISCOUNT_FRAC(): Promise<BigNumber> {
    return this.contract.WHITELIST_DISCOUNT_FRAC().then(converters.bneToBn);
  }

  get PUBLIC_DISCOUNT_FRAC(): Promise<BigNumber> {
    return this.contract.PUBLIC_DISCOUNT_FRAC().then(converters.bneToBn);
  }

  async calculatePriceFraction(priceFrac: BigNumber): Promise<BigNumber> {
    return this.contract
      .calculatePriceFraction(converters.bnToBne(priceFrac))
      .then(converters.bneToBn);
  }

  async whitelistTicket(investor: string): Promise<[boolean, BigNumber, BigNumber]> {
    const result = await this.contract.whitelistTicket(investor);
    return [result[0], converters.bneToBn(result[1]), converters.bneToBn(result[2])];
  }
}

export { ETOTermsAdapterFactory };
