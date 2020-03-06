import { createLibSymbol } from "@neufund/shared-modules";

import { AppStorage } from "./classes/AppStorage";
import { AsyncStorageProvider } from "./classes/AsyncStorageProvider";

export const symbols = {
  appStorage: createLibSymbol<AppStorage<any>>("appStorage"),
  appStorageProvider: createLibSymbol<AsyncStorageProvider>("asyncStorageProvider"),
};
