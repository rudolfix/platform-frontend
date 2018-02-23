import { inject, injectable } from "inversify";
import { symbols } from "../../di/symbols";
import { ILogger } from "../dependencies/Logger";
import { Storage } from "./Storage";

const STORAGE_JWT_KEY = "NF_JWT";

/**
 * Stores and retrieves JWT in injected storage.
 */
@injectable()
export class JwtStorage {
  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  save(jwt: string): void {
    this.logger.info(`Storing JWT in storage...`);

    this.storage.setKey(STORAGE_JWT_KEY, jwt);
  }

  get(): string | undefined {
    const rawData = this.storage.getKey(STORAGE_JWT_KEY);
    if (!rawData) {
      this.logger.info(`JWT missing from storage`);
      return undefined;
    }

    this.logger.info(`JWT got from storage`);
    return rawData;
  }
}
