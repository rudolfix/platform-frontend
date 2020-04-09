import { IBasicContractAdapter } from "./IBasicContractAdapter";
import { IRateOracleAdapter } from "./IRateOracleAdapter";

/**
 * An interface syncing ContractsService implementation between platforms (web and mobile)
 */
interface IContractsService {
  /**
   * Tokens
   */
  neumark: IBasicContractAdapter;
  etherToken: IBasicContractAdapter;
  euroToken: IBasicContractAdapter;

  /**
   * Services
   */
  rateOracle: IRateOracleAdapter;
}

export { IContractsService };
