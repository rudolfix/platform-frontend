import { IControllerGovernanceAdapter } from "@neufund/shared-modules";
import { providers, Signer } from "ethers";

import { IControllerGovernanceFactory } from "lib/contracts/IControllerGovernanceFactory";

class ControllerGovernanceAdapterFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | providers.Provider,
  ): IControllerGovernanceAdapter {
    return IControllerGovernanceFactory.connect(address, signerOrProvider);
  }
}

export { ControllerGovernanceAdapterFactory };
