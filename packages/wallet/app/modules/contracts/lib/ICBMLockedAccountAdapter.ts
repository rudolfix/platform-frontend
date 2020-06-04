import { IICBMLockedAccountAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { ICBMLockedAccount } from "lib/contracts/ICBMLockedAccount";
import { ICBMLockedAccountFactory } from "lib/contracts/ICBMLockedAccountFactory";

class ICBMLockedAccountAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): ICBMLockedAccountAdapter {
    return new ICBMLockedAccountAdapter(
      ICBMLockedAccountFactory.connect(address, signerOrProvider),
    );
  }
}

/**
 * An adapter for ERC20 Tokens to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class ICBMLockedAccountAdapter implements IICBMLockedAccountAdapter {
  readonly address: string;
  readonly currentMigrationTarget: Promise<string>;

  constructor(private readonly accountContract: ICBMLockedAccount) {
    this.address = accountContract.address;
    this.currentMigrationTarget = accountContract.currentMigrationTarget();
  }

  async balanceOf(address: string): Promise<[BigNumber, BigNumber, BigNumber]> {
    const result = await this.accountContract.balanceOf(address);
    return [
      new BigNumber(result[0].toString()),
      new BigNumber(result[1].toString()),
      new BigNumber(result[2].toString()),
    ];
  }
}

export { ICBMLockedAccountAdapterFactory };
