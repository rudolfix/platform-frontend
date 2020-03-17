import { coreModuleApi, createLibSymbol } from "@neufund/shared-modules";
import { TConfig } from "./types";

export const symbols = {
  // symbols passed through shared-modules
  logger: coreModuleApi.symbols.logger,
  config: createLibSymbol<TConfig>("config"),
};
