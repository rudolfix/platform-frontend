import { coreModuleApi, createLibSymbol } from "@neufund/shared-modules";

import { TConfig } from "./types";
import { Permissions } from "../modules/permissions/Permissions";

export const symbols = {
  // symbols passed through shared-modules
  logger: coreModuleApi.symbols.logger,

  config: createLibSymbol<TConfig>("config"),
  permissions: createLibSymbol<Permissions>("permissions"),
};
