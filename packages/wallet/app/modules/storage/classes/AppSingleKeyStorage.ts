import { inject, injectable } from "inversify";
import { AsyncStorageProvider } from "../index";
import { IStorageItem } from "../types/IStorageItem";
import { IStorageSchema } from "../types/IStorageSchema";
import { AppStorage } from "./AppStorage";
import { coreModuleApi, ILogger } from "@neufund/shared-modules";
import { symbols } from "../../../di/symbols";

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

  async setItem(value: DataType): Promise<IStorageItem<DataType>> {
    return this.storage.setItem(this.key, value);
  }

  async getItem(): Promise<IStorageItem<DataType> | null> {
    return this.storage.getItem(this.key);
  }

  async removeItem() {
    return this.storage.removeItem(this.key);
  }

  async clear(): Promise<void> {
    return this.storage.clear();
  }
}

export { AppSingleKeyStorage };
