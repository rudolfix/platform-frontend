import { IFeeDisbursalAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { IFeeDisbursal } from "lib/contracts/IFeeDisbursal";
import { IFeeDisbursalFactory } from "lib/contracts/IFeeDisbursalFactory";

import { converters } from "./utils";

class FeeDisbursalAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IFeeDisbursalAdapter {
    return new FeeDisbursalAdapter(IFeeDisbursalFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for Fee Disbursal to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class FeeDisbursalAdapter implements IFeeDisbursalAdapter {
  readonly address: string;

  constructor(private readonly feeDisbursalContract: IFeeDisbursal) {
    this.address = feeDisbursalContract.address;
  }

  async claimableMutipleByToken(
    tokens: string[],
    proRataToken: BigNumber | string,
    claimer: BigNumber | string,
  ): Promise<BigNumber[][]> {
    const result = await this.feeDisbursalContract.claimableMutipleByToken(
      tokens,
      proRataToken.toString(),
      claimer.toString(),
    );
    return converters.bneToBnArray2d(result);
  }

  async getNonClaimableDisbursals(
    token: BigNumber | string,
    proRataToken: BigNumber | string,
  ): Promise<BigNumber[][]> {
    const result = await this.feeDisbursalContract.getNonClaimableDisbursals(
      token.toString(),
      proRataToken.toString(),
    );
    return converters.bneToBnArray2d(result);
  }
}

export { FeeDisbursalAdapterFactory };
