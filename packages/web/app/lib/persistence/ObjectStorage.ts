import { ILogger, ISingleKeyStorage } from "@neufund/shared-modules";
import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { Storage } from "./Storage";

@injectable()
export class ObjectStorage<T> implements ISingleKeyStorage<T> {
  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
    private readonly key: string,
  ) {}

  public async set(value: T): Promise<void> {
    this.logger.info(`Setting key: ${this.key} on storage`);
    this.storage.setKey(this.key, JSON.stringify(value));
  }

  public async get(): Promise<T | undefined> {
    this.logger.info(`Getting key: ${this.key} from storage`);

    const value = this.storage.getKey(this.key);

    return value ? JSON.parse(value) : undefined;
  }

  public async clear(): Promise<void> {
    this.logger.info(`Clearing storage for key ${this.key}`);
    this.storage.removeKey(this.key);
  }
}
