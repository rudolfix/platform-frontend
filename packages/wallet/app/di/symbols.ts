import { coreModuleApi, createLibSymbol } from "@neufund/shared-modules";

import { TConfig } from "./types";
import { Permissions } from "../modules/permissions/Permissions";
import { DeviceInformation } from "../modules/device-information/DeviceInformation";

export const symbols = {
  // symbols passed through shared-modules
  logger: coreModuleApi.symbols.logger,
  config: createLibSymbol<TConfig>("config"),
  permissions: createLibSymbol<Permissions>("permissions"),
  deviceInformation: createLibSymbol<DeviceInformation>("deviceInformation")
};
