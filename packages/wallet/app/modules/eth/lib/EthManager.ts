import { EthereumAddress, EthereumPrivateKey, EthereumHDMnemonic } from "@neufund/shared";
import { coreModuleApi, ILogger, TLibSymbolType } from "@neufund/shared-modules";
import { providers, utils } from "ethers";
import { inject, injectable } from "inversify";

import { EthModuleError } from "../errors";
import { privateSymbols } from "./symbols";
import { EthAdapter } from "./EthAdapter";
import { EthWallet } from "./EthWallet";
import { EthWalletFactory } from "./EthWalletFactory";
import { TTransactionRequestRequired } from "./types";

class EthManagerError extends EthModuleError {
  constructor(message: string) {
    super(`EthManagerError: ${message}`);
  }
}

class WalletAlreadyInMemoryError extends EthManagerError {
  constructor() {
    super("Wallet is already plugged");
  }
}

class NoWalletPluggedError extends EthManagerError {
  constructor() {
    super("No wallet plugged");
  }
}

class NoWalletToPlugError extends EthManagerError {
  constructor() {
    super("No wallet to plug");
  }
}

/**
 * Hides all ETH related API under single instance.
 */
@injectable()
class EthManager {
  private readonly adapter: EthAdapter;

  private readonly logger: ILogger;

  private readonly ethWalletFactory: EthWalletFactory;
  private wallet: EthWallet | undefined;

  constructor(
    @inject(privateSymbols.rpcUrl) rpcUrl: string,
    @inject(coreModuleApi.symbols.logger) logger: ILogger,
    @inject(privateSymbols.ethWalletFactory) ethWalletFactory: EthWalletFactory,
    @inject(privateSymbols.ethAdapterFactory)
    ethAdapterFactory: TLibSymbolType<typeof privateSymbols.ethAdapterFactory>,
  ) {
    this.logger = logger;
    this.ethWalletFactory = ethWalletFactory;

    this.adapter = ethAdapterFactory(rpcUrl);

    this.logger.info(`EthManager initialized. Rpc URL: ${rpcUrl}`);
  }

  /**
   * Returns the current ETH balance of a given address.
   *
   * @param address - An ethereum address
   */
  getBalance(address: EthereumAddress): Promise<utils.BigNumber> {
    return this.adapter.getBalance(address);
  }

  /**
   * Check if there is already existing wallet in the memory.
   *
   * @note Make sure to check for wallet before calling `plugExistingWallet`.
   */
  async hasExistingWallet() {
    return this.ethWalletFactory.hasExistingWallet();
  }

  /**
   * Throws if there is already existing wallet in the memory.
   *
   * @throws WalletAlreadyInMemoryError - When wallet is already available
   */
  async assertHasNoExistingWallet() {
    if (await this.ethWalletFactory.hasExistingWallet()) {
      throw new WalletAlreadyInMemoryError();
    }
  }

  /**
   * Plugs existing wallet.
   *
   * @throws NoWalletToPlugError when there is not wallet in memory
   */
  async plugExistingWallet() {
    if (!(await this.hasExistingWallet())) {
      throw new NoWalletToPlugError();
    }

    this.logger.info("Plugging existing wallet");

    this.wallet = await this.ethWalletFactory.createFromExisting();

    // TODO: Emit in future even for sagas to refresh ui

    this.logger.info("Existing wallet plugged");
  }

  /**
   * For a give privateKey saves and plugs a new wallet.
   *
   * @param privateKey - A private key
   */
  async plugNewWalletFromPrivateKey(privateKey: EthereumPrivateKey) {
    // do not allow pinning new wallet if there is existing one
    // removing wallet should be a completely separate process with own presence confirmation
    this.assertHasNoExistingWallet();

    this.logger.info("Plugging a new wallet from private key");

    this.wallet = await this.ethWalletFactory.createFromPrivateKey(privateKey);

    this.logger.info("New wallet from private key plugged");
  }

  /**
   * For a give mnemonic saves and plugs a new wallet.
   *
   * @param mnemonic - A mnemonic
   */
  async plugNewWalletFromMnemonic(mnemonic: EthereumHDMnemonic) {
    // do not allow pinning new wallet if there is existing one
    // removing wallet should be a completely separate process with own presence confirmation
    this.assertHasNoExistingWallet();

    this.logger.info("Plugging a new wallet from mnemonics");

    this.wallet = await this.ethWalletFactory.createFromMnemonic(mnemonic);

    this.logger.info("New wallet from mnemonics plugged");
  }

  /**
   * Plugs new random wallet
   */
  async plugNewRandomWallet() {
    // do not allow pinning new wallet if there is existing one
    // removing wallet should be a completely separate process with own presence confirmation
    this.assertHasNoExistingWallet();

    this.logger.info("Plugging a new random wallet");

    this.wallet = await this.ethWalletFactory.createRandom();

    this.logger.info("New random wallet plugged");
  }

  /**
   * Unplugs and deletes wallet data from the memory.
   *
   * @note This operation is irreversible and wallet can be replugged only from backup codes.
   */
  async unsafeDeleteWallet(): Promise<void> {
    if (!this.wallet) {
      throw new NoWalletPluggedError();
    }

    const address = this.wallet.walletMetadata.address;

    this.logger.info(`Deleting a wallet for ${address}`);

    await this.ethWalletFactory.unsafeDeleteWallet(this.wallet);
    this.wallet = undefined;

    this.logger.info(`Wallet for ${address} deleted`);
  }

  /**
   * Exports wallet private key to the UI
   *
   * @note This operation is unsafe as private key is exposed to the UI
   *        therefore put without any encryption to the RAM memory
   *
   * @throws NoWalletPluggedError - When no wallet was plugged yet
   */
  unsafeExportWalletPrivateKey = async (): Promise<EthereumPrivateKey> => {
    if (!this.wallet) {
      throw new NoWalletPluggedError();
    }

    return this.wallet.unsafeExportPrivateKey();
  };

  /**
   * Exports wallet mnemonic to the UI
   *
   * @note This operation is unsafe as mnemonic is exposed to the UI
   *        therefore put without any encryption to the RAM memory
   *
   * @throws NoWalletPluggedError - When no wallet was plugged yet
   */
  unsafeExportWalletMnemonic = async (): Promise<EthereumHDMnemonic> => {
    if (!this.wallet) {
      throw new NoWalletPluggedError();
    }

    return this.wallet.unsafeExportMnemonic();
  };

  /**
   * Signs a message with a currently plugged wallet
   *
   * @throws NoWalletPluggedError - When no wallet was plugged yet
   *
   * @param message - A message to be signed
   */
  async signMessage(message: string): Promise<string> {
    if (!this.wallet) {
      throw new NoWalletPluggedError();
    }

    return this.wallet.signMessage(message);
  }

  /**
   * Signs a transaction with a currently plugged wallet
   *
   * @throws NoWalletPluggedError - When no wallet was plugged yet
   *
   * @param transaction - A transaction to be signed
   */
  async signTransaction(transaction: TTransactionRequestRequired): Promise<string> {
    if (!this.wallet) {
      throw new NoWalletPluggedError();
    }

    const tx = await this.populateTransaction(transaction);

    return this.wallet.signTransaction(tx);
  }

  /**
   * Signs and sends transaction
   *
   * @param transaction - A transaction to be signed and send
   */
  async sendTransaction(
    transaction: TTransactionRequestRequired,
  ): Promise<providers.TransactionResponse> {
    const signedTx = await this.signTransaction(transaction);

    return this.adapter.sendTransaction(signedTx);
  }

  private async populateTransaction({
    from,
    ...rest
  }: TTransactionRequestRequired): Promise<utils.UnsignedTransaction> {
    this.logger.info("Populating transaction with missing data");

    const [to, nonce, chainId] = await Promise.all([
      this.adapter.resolveName(rest.to),
      this.adapter.getTransactionCountFromPending(from),
      this.adapter.getChainId(),
    ]);

    return {
      ...rest,
      to,
      nonce,
      chainId,
    };
  }
}

export { EthManager, NoWalletPluggedError, EthManagerError, WalletAlreadyInMemoryError };