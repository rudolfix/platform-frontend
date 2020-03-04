import { coreModuleApi } from "@neufund/shared-modules";
import { symbols as appStorageSymbols } from "../modules/storage";

export const symbols = {
  // symbols passed through shared-modules
  logger: coreModuleApi.symbols.logger,
  ...appStorageSymbols,
};
