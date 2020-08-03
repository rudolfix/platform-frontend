import { IERC20TokenAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { IERC20Token } from "lib/contracts/IERC20Token";
import { IERC20TokenFactory } from "lib/contracts/IERC20TokenFactory";

import { converters } from "./utils";

class ERC20TokenAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IERC20TokenAdapter {
    return new ERC20TokenAdapter(IERC20TokenFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for ERC20 Tokens to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class ERC20TokenAdapter implements IERC20TokenAdapter {
  readonly address: string;

  constructor(private readonly tokenContract: IERC20Token) {
    this.address = tokenContract.address;
  }

  async balanceOf(address: string): Promise<BigNumber> {
    return this.tokenContract.balanceOf(address).then(converters.bneToBn);
  }
}

export { ERC20TokenAdapterFactory };
