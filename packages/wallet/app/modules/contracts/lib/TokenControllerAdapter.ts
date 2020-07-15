import { ITokenControllerAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { ITokenController } from "lib/contracts/ITokenController";
import { ITokenControllerFactory } from "lib/contracts/ITokenControllerFactory";

import { converters } from "./utils";

class TokenControllerAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): ITokenControllerAdapter {
    return new TokenControllerAdapter(ITokenControllerFactory.connect(address, signerOrProvider));
  }
}

/**
 * An adapter for Token Controller to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class TokenControllerAdapter implements ITokenControllerAdapter {
  readonly address: string;

  constructor(private readonly contract: ITokenController) {
    this.address = contract.address;
  }

  async onTransfer(broker: string, from: string, to: string, amount: BigNumber): Promise<boolean> {
    return this.contract.onTransfer(broker, from, to, converters.bnToBne(amount));
  }
}

export { TokenControllerAdapterFactory };
