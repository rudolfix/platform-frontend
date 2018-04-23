import { inject, injectable } from "inversify";
import { symbols } from "../../di/symbols";
import { invariant } from "../../utils/invariant";
import { ILogger } from "../dependencies/Logger";
import { TUserType } from "./../api/users/interfaces";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";
import {
  STORAGE_WALLET_METADATA_INVESTOR_KEY,
  STORAGE_WALLET_METADATA_ISSUER_KEY,
} from "./WalletMetadataObjectStorage";

@injectable()
export class WalletStorage<TWalletMetadata> {
  private walletMetadataStorageInvestor: ObjectStorage<TWalletMetadata>;
  private walletMetadataStorageIssuer:  ObjectStorage<TWalletMetadata>;

  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {
    this.walletMetadataStorageInvestor = new ObjectStorage<TWalletMetadata>(
      this.storage,
      this.logger,
      STORAGE_WALLET_METADATA_INVESTOR_KEY,
    );
    this.walletMetadataStorageIssuer = new ObjectStorage<TWalletMetadata>(
      this.storage,
      this.logger,
      STORAGE_WALLET_METADATA_ISSUER_KEY,
    );
  }

  public set(userType: TUserType, value:  TWalletMetadata): void {
    switch (userType) {
      case "issuer":
        this.walletMetadataStorageIssuer.set(value);
        break;
      case "investor":
        this.walletMetadataStorageInvestor.set(value);
        break;
      default:
        invariant(false, "Unknown user type");
    }
  }

  public get(userType: TUserType): TWalletMetadata | undefined {
    switch (userType) {
      case "issuer":
        return this.walletMetadataStorageIssuer.get();
      case "investor":
        return this.walletMetadataStorageInvestor.get();
      default:
        invariant(false, "Unknown user type");
    }
  }

  public clear(userType: TUserType): void {
    switch (userType) {
      case "issuer":
        return this.walletMetadataStorageIssuer.clear();
      case "investor":
        return this.walletMetadataStorageInvestor.clear();
      default:
        invariant(false, "Unknown user type");
    }
  }
}
