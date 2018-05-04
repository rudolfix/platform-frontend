import { inject, injectable } from "inversify";
import promiseAll from "promise-all";

import { IConfig } from "../../config/getConfig";
import { symbols } from "../../di/symbols";
import { Commitment } from "../contracts/Commitment";
import { EtherToken } from "../contracts/EtherToken";
import { EuroToken } from "../contracts/EuroToken";
import { LockedAccount } from "../contracts/LockedAccount";
import { Neumark } from "../contracts/Neumark";
import { ILogger } from "../dependencies/Logger";
import { Web3Manager } from "./Web3Manager";

@injectable()
export class ContractsService {
  public universeContract!: Commitment;

  public neumarkContract!: Neumark;
  public euroTokenContract!: EuroToken;
  public etherTokenContract!: EtherToken;

  public euroLock!: LockedAccount;
  public etherLock!: LockedAccount;

  constructor(
    @inject(symbols.config) private readonly config: IConfig,
    @inject(symbols.web3Manager) private readonly web3Manager: Web3Manager,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  public async init(): Promise<void> {
    this.logger.info("Initializing contracts...");
    const web3 = this.web3Manager.internalWeb3Adapter.web3;

    this.universeContract = await Commitment.createAndValidate(
      web3,
      this.config.contractsAddresses.universeContractAddress,
    );

    const { neumarkAddress, euroLockAddress, etherLockAddress } = await promiseAll({
      neumarkAddress: this.universeContract.neumark,
      euroLockAddress: this.universeContract.euroLock,
      etherLockAddress: this.universeContract.etherLock,
    });

    this.neumarkContract = await Neumark.createAndValidate(web3, neumarkAddress);
    this.euroLock = await LockedAccount.createAndValidate(web3, euroLockAddress);
    this.etherLock = await LockedAccount.createAndValidate(web3, etherLockAddress);

    const { euroTokenAddress, etherTokenAddress } = await promiseAll({
      euroTokenAddress: this.euroLock.assetToken,
      etherTokenAddress: this.etherLock.assetToken,
    });

    this.euroTokenContract = await EuroToken.createAndValidate(web3, euroTokenAddress);
    this.etherTokenContract = await EtherToken.createAndValidate(web3, etherTokenAddress);
    this.logger.info("Initializing contracts DONE.");
  }
}
