import { IIdentityRegistryAdapter } from "@neufund/shared-modules";
import { providers, Signer } from "ethers";

import { IIdentityRegistryFactory } from "lib/contracts/IIdentityRegistryFactory";

class IdentityRegistryAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IIdentityRegistryAdapter {
    return IIdentityRegistryFactory.connect(address, signerOrProvider);
  }
}

export { IdentityRegistryAdapterFactory };
