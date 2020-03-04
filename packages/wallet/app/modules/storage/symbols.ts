import { createLibSymbol } from "@neufund/shared-modules";
import { AppStorage } from "./classes/AppStorage";
import { AsyncStorageProvider } from "./classes/AsyncStorageProvider";
import { AppSingleKeyStorage } from "./classes/AppSingleKeyStorage";

export const symbols = {
  appStorage: createLibSymbol<AppStorage<any>>("appStorage"),
  singleKeyAppStorage: createLibSymbol<AppSingleKeyStorage<any>>("singleKeyAppStorage"),
  appStorageProvider: createLibSymbol<AsyncStorageProvider>("asyncStorageProvider"),
};
