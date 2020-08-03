import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { BigNumber } from "bignumber.js";

import { IControllerGovernanceAdapter } from "./IControllerGovernanceAdapter";
import { IEquityTokenAdapter } from "./IEquityTokenAdapter";
import { IERC20TokenAdapter } from "./IERC20TokenAdapter";
import { IETOCommitmentAdapter } from "./IETOCommitmentAdapter";
import { IETOTermsAdapter } from "./IETOTermsAdapter";
import { IFeeDisbursalAdapter } from "./IFeeDisbursalAdapter";
import { IIdentityRegistryAdapter } from "./IIdentityRegistryAdapter";
import { IICBMLockedAccountAdapter, ILockedAccountAdapter } from "./ILockedAccountAdapter";
import { IRateOracleAdapter } from "./IRateOracleAdapter";
import { ISnapshotableTokenAdapter } from "./ISnapshotableTokenAdapter";
import { ITokenControllerAdapter } from "./ITokenControllerAdapter";

/**
 * An interface syncing ContractsService implementation between platforms (web and mobile)
 */
interface IContractsService {
  /**
   * Special functions (ether balance)
   */
  // TODO: move to new eth module
  balanceOf: (address: EthereumAddressWithChecksum) => Promise<BigNumber>;

  /**
   * Tokens
   */
  neumark: ISnapshotableTokenAdapter;
  etherToken: IERC20TokenAdapter;
  euroToken: IERC20TokenAdapter;

  /**
   * Locked acccounts
   */
  icbmEuroLock: IICBMLockedAccountAdapter;
  icbmEtherLock: IICBMLockedAccountAdapter;
  euroLock: ILockedAccountAdapter;
  etherLock: ILockedAccountAdapter;

  /**
   * Identity
   */
  identityRegistry: IIdentityRegistryAdapter;

  /**
   * Services
   */
  rateOracle: IRateOracleAdapter;
  feeDisbursal: IFeeDisbursalAdapter;

  /**
   * Contract getters
   */
  getETOCommitmentContract(etoId: string): Promise<IETOCommitmentAdapter>;
  getEtoTerms(etoTermdid: string): Promise<IETOTermsAdapter>;
  getTokenController(controllerId: string): Promise<ITokenControllerAdapter>;
  getControllerGovernance(governanceId: string): Promise<IControllerGovernanceAdapter>;
  getEquityToken(equityTokenAddress: string): Promise<IEquityTokenAdapter>;
}

export { IContractsService };
