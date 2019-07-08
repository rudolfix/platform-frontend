import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { EUserType } from "../api/users/interfaces";
import { ILogger } from "../dependencies/logger";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";
import { STORAGE_WALLET_METADATA_KEY, TStoredWalletMetadata } from "./WalletMetadataObjectStorage";

@injectable()
export class WalletStorage {
  private walletMetadataStorage: ObjectStorage<TStoredWalletMetadata>;

  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {
    this.walletMetadataStorage = new ObjectStorage<TStoredWalletMetadata>(
      this.storage,
      this.logger,
      STORAGE_WALLET_METADATA_KEY,
    );
  }

  public set(value: TStoredWalletMetadata): void {
    this.walletMetadataStorage.set(value);
  }

  public get(): TStoredWalletMetadata | undefined {
    const metadata = this.walletMetadataStorage.get();
    if (metadata && !metadata.userType) {
      // provide fallback for storage saved without user type
      metadata.userType = EUserType.INVESTOR;
    }
    return metadata;
  }

  public clear(): void {
    return this.walletMetadataStorage.clear();
  }
}
