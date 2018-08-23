import { inject, injectable } from "inversify";
import * as promiseAll from "promise-all";

import { IConfig } from "../../config/getConfig";
import { symbols } from "../../di/symbols";
import { EtherToken } from "../contracts/EtherToken";
import { EuroToken } from "../contracts/EuroToken";
import { ICBMLockedAccount } from "../contracts/ICBMLockedAccount";
import { Neumark } from "../contracts/Neumark";
import { Universe } from "../contracts/Universe";
import { ILogger } from "../dependencies/Logger";
import { Commitment } from "./CommitmentDeprecated";
import { knownInterfaces } from "./knownInterfaces";
import { Web3Manager } from "./Web3Manager";

@injectable()
export class ContractsService {
  private universeContract!: Universe;

  public neumarkContract!: Neumark;
  public euroTokenContract!: EuroToken;
  public etherTokenContract!: EtherToken;

  public euroLock!: ICBMLockedAccount;
  public etherLock!: ICBMLockedAccount;

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
      euroTokenAddress,
      etherTokenAddress,
    ] = await this.universeContract.getManySingletons([
      knownInterfaces.neumark,
      knownInterfaces.icbmEuroLock,
      knownInterfaces.etherLock, // @todo: THIS SHOULD BE icbmEtherLock but it's not b/c it's not deployed atm
      knownInterfaces.icbmEuroToken,
      knownInterfaces.icbmEtherToken,
    ].map(v => v.toString()));

    this.neumarkContract = await create(Neumark, web3, neumarkAddress);
    this.euroLock = await create(ICBMLockedAccount, web3, euroLockAddress);
    this.etherLock = await create(ICBMLockedAccount, web3, etherLockAddress);
    this.euroTokenContract = await create(EuroToken, web3, euroTokenAddress);
    this.etherTokenContract = await create(EtherToken, web3, etherTokenAddress);

    this.logger.info("Initializing contracts DONE.");
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

    this.neumarkContract = await create(Neumark, web3, neumarkAddress);
    const euroLock = await create(ICBMLockedAccount, web3, euroLockAddress);
    const etherLock = await create(ICBMLockedAccount, web3, etherLockAddress);

    this.euroLock = euroLock as any;
    this.etherLock = etherLock as any;

    const { euroTokenAddress, etherTokenAddress } = await promiseAll({
      euroTokenAddress: euroLock.assetToken,
      etherTokenAddress: etherLock.assetToken,
    });

    this.euroTokenContract = await create(EuroToken, web3, euroTokenAddress);
    this.etherTokenContract = await create(EtherToken, web3, etherTokenAddress);
    this.logger.info("Initializing contracts DONE.");
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
