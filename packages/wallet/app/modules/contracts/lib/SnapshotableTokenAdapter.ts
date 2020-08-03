import { ISnapshotableTokenAdapter } from "@neufund/shared-modules";
import { BigNumber } from "bignumber.js";
import { providers, Signer } from "ethers";

import { ISnapshotableToken } from "lib/contracts/ISnapshotableToken";
import { ISnapshotableTokenFactory } from "lib/contracts/ISnapshotableTokenFactory";

import { converters } from "./utils";

class SnapshotableTokenAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): ISnapshotableTokenAdapter {
    return new SnapshotableTokenAdapter(
      ISnapshotableTokenFactory.connect(address, signerOrProvider),
    );
  }
}

/**
 * An adapter for Snapshottable Tokens to hide implementation differences between web3 and ethers generated contracts interfaces
 */
class SnapshotableTokenAdapter implements ISnapshotableTokenAdapter {
  readonly address: string;

  constructor(private readonly tokenContract: ISnapshotableToken) {
    this.address = tokenContract.address;
  }

  get currentSnapshotId(): Promise<BigNumber> {
    return this.tokenContract.currentSnapshotId().then(converters.bneToBn);
  }

  async balanceOf(address: string): Promise<BigNumber> {
    return this.tokenContract.balanceOf(address).then(converters.bneToBn);
  }
}

export { SnapshotableTokenAdapterFactory, SnapshotableTokenAdapter };
