import { inject, injectable } from "inversify";
import * as promiseAll from "promise-all";

import { IConfig } from "../../config/getConfig";
import { symbols } from "../../di/symbols";
import { EtherToken } from "../contracts/EtherToken";
import { ETOCommitment } from "../contracts/ETOCommitment";
import { EuroToken } from "../contracts/EuroToken";
import { ICBMLockedAccount } from "../contracts/ICBMLockedAccount";
import { IdentityRegistry } from "../contracts/IdentityRegistry";
import { ITokenExchangeRateOracle } from "../contracts/ITokenExchangeRateOracle";
import { LockedAccount } from "../contracts/LockedAccount";
import { Neumark } from "../contracts/Neumark";
import { PlatformTerms } from "../contracts/PlatformTerms";
import { Universe } from "../contracts/Universe";
import { ILogger } from "../dependencies/Logger";
import { Commitment } from "./CommitmentDeprecated";
import { Web3Manager } from "./Web3Manager";

import * as knownInterfaces from "../contracts/knownInterfaces.json";

@injectable()
export class ContractsService {
  private universeContract!: Universe;
  private etoCommitmentCache: {[etoId: string]: ETOCommitment} = {}

  public neumark!: Neumark;
  public euroToken!: EuroToken;
  public etherToken!: EtherToken;

  public euroLock!: LockedAccount;
  public etherLock!: LockedAccount;
  public icbmEuroLock!: ICBMLockedAccount;
  public icbmEtherLock!: ICBMLockedAccount;
  public identityRegistry!: IdentityRegistry;
  public platformTerms!: PlatformTerms;
  public rateOracle!: ITokenExchangeRateOracle;

  constructor(
    @inject(symbols.config) private readonly config: IConfig,
    @inject(symbols.web3Manager) private readonly web3Manager: Web3Manager,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  public async init(): Promise<void> {
    this.logger.info("Initializing contracts...");
    const web3 = this.web3Manager.internalWeb3Adapter.web3;
    if (process.env.NF_CONTRACTS_NEW !== "1") {
      return this.initDeprecated();
    }

    this.universeContract = await create(
      Universe,
      web3,
      this.config.contractsAddresses.universeContractAddress,
    );

    const [
      neumarkAddress,
      euroLockAddress,
      etherLockAddress,
      icbmEuroLockAddress,
      icbmEtherLockAddress,
      euroTokenAddress,
      etherTokenAddress,
      tokenExchangeRateOracleAddress,
      identityRegistryAddress,
      platformTermsAddress,
    ] = await this.universeContract.getManySingletons([
      knownInterfaces.neumark,
      knownInterfaces.euroLock,
      knownInterfaces.etherLock,
      knownInterfaces.icbmEuroLock,
      knownInterfaces.icbmEtherLock,
      knownInterfaces.euroToken,
      knownInterfaces.etherToken,
      knownInterfaces.tokenExchangeRateOracle,
      knownInterfaces.identityRegistry,
      knownInterfaces.platformTerms,
    ]);

    this.neumark = await create(Neumark, web3, neumarkAddress);
    this.euroLock = await create(LockedAccount, web3, euroLockAddress);
    this.etherLock = await create(LockedAccount, web3, etherLockAddress);
    this.icbmEuroLock = await create(ICBMLockedAccount, web3, icbmEuroLockAddress);
    this.icbmEtherLock = await create(ICBMLockedAccount, web3, icbmEtherLockAddress);
    this.rateOracle = await create(ITokenExchangeRateOracle, web3, tokenExchangeRateOracleAddress);
    this.identityRegistry = await create(IdentityRegistry, web3, identityRegistryAddress);
    this.platformTerms = await create(PlatformTerms, web3, platformTermsAddress);
    this.euroToken = await create(EuroToken, web3, euroTokenAddress);
    this.etherToken = await create(EtherToken, web3, etherTokenAddress);

    this.etherToken.rawWeb3Contract.transfer.getData()

    this.logger.info("Initializing contracts via UNIVERSE is DONE.");
  }

  public async initDeprecated(): Promise<void> {
    const web3 = this.web3Manager.internalWeb3Adapter.web3;

    const commitmentContract = await create(
      Commitment,
      web3,
      this.config.contractsAddresses.universeContractAddress,
    );

    const { neumarkAddress, euroLockAddress, etherLockAddress } = await promiseAll({
      neumarkAddress: commitmentContract.neumark,
      euroLockAddress: commitmentContract.euroLock,
      etherLockAddress: commitmentContract.etherLock,
    });

    this.neumark = await create(Neumark, web3, neumarkAddress);
    this.icbmEuroLock = await create(ICBMLockedAccount, web3, euroLockAddress);
    this.icbmEtherLock = await create(ICBMLockedAccount, web3, etherLockAddress);

    const { euroTokenAddress, etherTokenAddress } = await promiseAll({
      euroTokenAddress: this.icbmEuroLock.assetToken,
      etherTokenAddress: this.icbmEtherLock.assetToken,
    });

    this.euroToken = await create(EuroToken, web3, euroTokenAddress);
    this.etherToken = await create(EtherToken, web3, etherTokenAddress);
    this.logger.info("Initializing contracts via ICBM COMMITMENT is DONE.");
  }

  async getETOCommitmentContract(etoId: string): Promise<ETOCommitment> {
    if (this.etoCommitmentCache[etoId]) return this.etoCommitmentCache[etoId]

    const web3 = this.web3Manager.internalWeb3Adapter.web3;
    const contract = await create(ETOCommitment, web3, etoId)
    this.etoCommitmentCache[etoId] = contract
    return contract
  }
}

/**
 * Creates contract wrapper.
 * In dev mode it will validate contract code to ease web3 development pains. In prod it will assume that address is correct, saving some network calls.
 */
async function create<T>(ContractCls: IContractCls<T>, web3: any, address: string): Promise<T> {
  if (process.env.NODE_ENV === "production") {
    return new ContractCls(web3, address);
  } else {
    return await ContractCls.createAndValidate(web3, address);
  }
}

interface IContractCls<T> {
  new (web3: any, address: string): T;
  createAndValidate(web3: any, address: string): Promise<T>;
}
