import { IEquityTokenAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { IEquityToken } from "lib/contracts/IEquityToken";
import { IEquityTokenFactory } from "lib/contracts/IEquityTokenFactory";

import { converters } from "./utils";

class EquityTokenAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IEquityTokenAdapter {
    return new EquityTokenAdapter(IEquityTokenFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for Equity Tokens to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class EquityTokenAdapter implements IEquityTokenAdapter {
  readonly address: string;

  constructor(private readonly contract: IEquityToken) {
    this.address = contract.address;
  }

  get tokensPerShare(): Promise<BigNumber> {
    return this.contract.tokensPerShare().then(converters.bneToBn);
  }

  get shareNominalValueUlps(): Promise<BigNumber> {
    return this.contract.shareNominalValueUlps().then(converters.bneToBn);
  }

  get tokenController(): Promise<string> {
    return this.contract.tokenController();
  }

  get currentSnapshotId(): Promise<BigNumber> {
    return this.contract.currentSnapshotId().then(converters.bneToBn);
  }

  get decimals(): Promise<BigNumber> {
    return this.contract.decimals().then(converters.nToBn);
  }

  async balanceOf(address: string): Promise<BigNumber> {
    return this.contract.balanceOf(address).then(converters.bneToBn);
  }
}

export { EquityTokenAdapterFactory };
