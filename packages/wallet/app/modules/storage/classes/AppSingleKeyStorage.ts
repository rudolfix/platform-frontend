import { inject, injectable } from "inversify";
import { coreModuleApi, ILogger } from "@neufund/shared-modules";

import { IStorageItem } from "../types/IStorageItem";
import { IStorageSchema } from "../types/IStorageSchema";
import { AppStorage } from "./AppStorage";
import { symbols } from "../symbols";
import { AsyncStorageProvider } from "./AsyncStorageProvider";

/**
 * A class representing a single key application storage
 * @class  AppStorage
 */
@injectable()
class AppSingleKeyStorage<DataType> {
  protected storage: AppStorage<DataType>;
  protected key: string;

  constructor(
    @inject(symbols.appStorageProvider) provider: AsyncStorageProvider,
    @inject(coreModuleApi.symbols.logger) logger: ILogger,
    storageKey: string,
    schema: IStorageSchema<DataType>,
  ) {
    this.storage = new AppStorage(provider, logger, storageKey, schema);
    this.key = storageKey;
  }

  async set(value: DataType): Promise<IStorageItem<DataType>> {
    return this.storage.setItem(this.key, value);
  }

  async getStorageItem(): Promise<IStorageItem<DataType> | null> {
    return this.storage.getItem(this.key);
  }

  async get(): Promise<DataType | null> {
    const storageItem = await this.getStorageItem();

    return storageItem ? storageItem.data : null;
  }

  async remove(): Promise<void> {
    await this.storage.removeItem(this.key);
  }
}

export { AppSingleKeyStorage };
