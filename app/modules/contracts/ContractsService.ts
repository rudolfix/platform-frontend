import { injectable, inject } from "inversify";
import { IConfig } from "../../config/getConfig";
import { symbols } from "../../di/symbols";
import { EuroToken } from "../../lib/contracts/EuroToken";
import { Neumark } from "../../lib/contracts/Neumark";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { ILogger } from "../../lib/dependencies/Logger";

@injectable()
export class ContractsService {
  public euroTokenContract: EuroToken;
  public neumarkContract: Neumark;

  constructor(
    @inject(symbols.config) private readonly config: IConfig,
    @inject(symbols.web3Manager) private readonly web3Manager: Web3Manager,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {
    // this is workaround to silent compiler error about not properties not assigned
    // its fine b/c we gonna always call async init method before using this class
    this.euroTokenContract = null as any;
    this.neumarkContract = null as any;
  }

  public async init() {
    this.logger.info("Contracts initialized");

    this.euroTokenContract = await EuroToken.createAndValidate(
      this.web3Manager.internalWeb3Adapter!.web3,
      this.config.contractsAddresses.euroTokenAddress,
    );
    this.neumarkContract = await Neumark.createAndValidate(
      this.web3Manager.internalWeb3Adapter!.web3,
      this.config.contractsAddresses.neumarkAddress,
    );
  }
}
