import { coreModuleApi, ILogger } from "@neufund/shared-modules";
import {
  assertNever,
  EthereumHDMnemonic,
  EthereumPrivateKey,
  toEthereumHDPath,
} from "@neufund/shared-utils";
import { inject, injectable } from "inversify";

import { EthModuleError } from "modules/eth/errors";
import { AppSingleKeyStorage } from "modules/storage";

import { EthSecureEnclave } from "./EthSecureEnclave";
import { EthWallet, TEthWalletProviderType } from "./EthWallet";
import { TSecureReference } from "./SecureStorage";
import { THDWalletMetadata, TPrivateKeyWalletMetadata, TWalletMetadata } from "./schemas";
import { privateSymbols } from "./symbols";
import { EWalletExistenceStatus, EWalletType, TWalletUIMetadata } from "./types";

class EthWalletFactoryError extends EthModuleError {
  constructor(message: string) {
    super(`EthWalletFactoryError: ${message}`);
  }
}

class NoExistingWalletFoundError extends EthWalletFactoryError {
  constructor() {
    super("No private key found for the given reference");
  }
}

/**
 * Default HD path used in lightwallet
 */
const DEFAULT_HD_PATH = toEthereumHDPath("m/44'/60'/0'/0");

/**
 * Abstracts the way wallet is created.
 * Manages the access to SecureStorage.
 *
 * @internal EthWalletCreator should only be used in EthManager and never exposed to DI container
 */
@injectable()
class EthWalletFactory {
  private readonly ethSecureEnclave: EthSecureEnclave;
  private readonly walletStorage: AppSingleKeyStorage<TWalletMetadata>;
  private readonly logger: ILogger;
  private readonly ethWalletProvider: TEthWalletProviderType;

  constructor(
    // TODO: Do not use global symbols in module, replace by storage module when ready
    @inject(privateSymbols.walletStorage) walletStorage: AppSingleKeyStorage<TWalletMetadata>,
    @inject(coreModuleApi.symbols.logger) logger: ILogger,
    @inject(privateSymbols.ethSecureEnclave) ethSecureEnclave: EthSecureEnclave,
    @inject(privateSymbols.ethWalletProvider)
    ethWalletProvider: TEthWalletProviderType,
  ) {
    this.ethSecureEnclave = ethSecureEnclave;
    this.walletStorage = walletStorage;
    this.logger = logger;
    this.ethWalletProvider = ethWalletProvider;
  }

  /**
   * Check if there is already existing wallet in the memory.
   *
   * @note Make sure to check for wallet before calling `createFromExisting`.
   */
  async getWalletExistenceStatus() {
    this.logger.info("Checking if there is an existing wallet");

    const walletMetadata = await this.walletStorage.get();

    let status: EWalletExistenceStatus = EWalletExistenceStatus.NOT_EXIST;

    if (walletMetadata) {
      const hasSecret = await this.ethSecureEnclave.hasSecret(walletMetadata.privateKeyReference);

      // in case there is no secret we may assume that in some way keychain was cleared out (for .e.g. biometrics have changed)
      status = hasSecret ? EWalletExistenceStatus.EXIST : EWalletExistenceStatus.LOST;
    }

    this.logger.info(`Wallet existence status is "${status}"`);

    return status;
  }

  /**
   * Check if existing wallet in memory has corresponding key reference available in secure enclave
   */
  async hasValidCredentials() {
    this.logger.info("Checking if wallet is in valid state");

    const walletMetadata = await this.walletStorage.get();

    let hasValidState = true;
    if (walletMetadata) {
      hasValidState = await this.ethSecureEnclave.hasAccessToSecret(
        walletMetadata.privateKeyReference,
      );
    }

    this.logger.info(`Existing wallet state ${hasValidState ? "is valid" : "is invalid"}`);

    return hasValidState;
  }

  /**
   * Returns existing wallet metadata (without key references)
   */
  async getExistingWalletMetadata(): Promise<TWalletUIMetadata | undefined> {
    this.logger.info("Getting existing wallet metadata");

    const metadata = await this.walletStorage.get();

    if (metadata) {
      return {
        name: metadata.name,
        address: metadata.address,
        type: metadata.type,
      };
    }

    return undefined;
  }

  /**
   * Creates a wallet from an existing metadata.
   *
   * @throws NoExistingWalletFoundError when no metadata available
   *
   * @returns A new EthWallet
   */
  async createFromExisting(): Promise<EthWallet> {
    const walletMetadata = await this.walletStorage.get();
    if (!walletMetadata) {
      throw new NoExistingWalletFoundError();
    }

    this.logger.info("Creating a wallet from existing");

    return this.ethWalletProvider(walletMetadata);
  }

  /**
   * Creates a wallet from private key.
   **
   * @returns A new EthWallet
   */
  async createFromPrivateKey(privateKey: EthereumPrivateKey, name?: string): Promise<EthWallet> {
    this.logger.info("Adding private key to the secure enclave");

    const privateKeyReference = await this.ethSecureEnclave.addSecret(privateKey);
    const address = await this.ethSecureEnclave.getAddress(privateKeyReference);

    const privateKeyWalletMetadata: TPrivateKeyWalletMetadata = {
      type: EWalletType.PRIVATE_KEY_WALLET,
      address,
      name,
      privateKeyReference,
    };

    this.logger.info("Saving metadata to the app storage", {
      address,
    });

    await this.walletStorage.set(privateKeyWalletMetadata);

    this.logger.info("Creating new wallet from private key");

    return this.ethWalletProvider(privateKeyWalletMetadata);
  }

  /**
   * Create a random new wallet
   *
   * @returns A new EthWallet
   */
  async createRandom(): Promise<EthWallet> {
    this.logger.info("Adding mnemonic to the secure enclave");

    const mnemonicReference = await this.ethSecureEnclave.createRandomMnemonic();

    return this.createFromMnemonicReference(mnemonicReference);
  }

  /**
   * Creates a wallet from mnemonic.
   *
   * @returns A new EthWallet
   */
  async createFromMnemonic(mnemonic: EthereumHDMnemonic, name?: string): Promise<EthWallet> {
    this.logger.info("Adding mnemonic to the secure enclave");

    const mnemonicReference = await this.ethSecureEnclave.addSecret(mnemonic);

    return this.createFromMnemonicReference(mnemonicReference, name);
  }

  /**
   * Deletes wallet from the devices
   *
   * @param ethWallet - An ethereum wallet to  delete from devices
   */
  async unsafeDeleteWallet({ walletMetadata }: EthWallet): Promise<void> {
    this.logger.info(`Deleting wallet from device`, {
      type: walletMetadata.type,
      address: walletMetadata.address,
    });

    switch (walletMetadata.type) {
      case EWalletType.HD_WALLET:
        await this.ethSecureEnclave.unsafeDeleteSecret(walletMetadata.privateKeyReference);
        await this.ethSecureEnclave.unsafeDeleteSecret(walletMetadata.mnemonicReference);
        break;
      case EWalletType.PRIVATE_KEY_WALLET:
        await this.ethSecureEnclave.unsafeDeleteSecret(walletMetadata.privateKeyReference);
        break;
      default:
        assertNever(walletMetadata);
    }

    await this.walletStorage.clear();
  }

  private async createFromMnemonicReference(mnemonicReference: TSecureReference, name?: string) {
    this.logger.info(`Deriving private key for a default hd path ${DEFAULT_HD_PATH}`);

    const privateKeyReference = await this.ethSecureEnclave.deriveKey(
      mnemonicReference,
      DEFAULT_HD_PATH,
    );

    const address = await this.ethSecureEnclave.getAddress(privateKeyReference);

    const hdWallet: THDWalletMetadata = {
      type: EWalletType.HD_WALLET,
      address,
      name,
      mnemonicReference,
      privateKeyReference,
      derivationPath: DEFAULT_HD_PATH,
    };

    this.logger.info("Saving metadata to the app storage", {
      address,
    });

    await this.walletStorage.set(hdWallet);

    this.logger.info("Creating new wallet from mnemonic");

    return this.ethWalletProvider(hdWallet);
  }
}

export { DEFAULT_HD_PATH, EthWalletFactory, NoExistingWalletFoundError };
