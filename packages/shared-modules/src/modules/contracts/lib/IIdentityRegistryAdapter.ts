import { IBasicContractAdapter } from "./IBasicContractAdapter";

/**
 * An adapter interface for for identity registry.
 * Given that interfaces between web3 and ethers.js are incompatible
 * an adapter is provided to align them to be used in shared code
 */
interface IIdentityRegistryAdapter extends IBasicContractAdapter {
  getClaims(address: string): Promise<string>;
}

export { IIdentityRegistryAdapter };
