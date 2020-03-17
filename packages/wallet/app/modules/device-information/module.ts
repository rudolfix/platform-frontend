import { setupBindings } from "./bindings";
import { symbols } from "./symbols";

const MODULE_ID = "device-information";

const setupDeviceInformationModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  api: setupDeviceInformationModuleApi,
});

const setupDeviceInformationModuleApi = {
  symbols,
};

export { setupDeviceInformationModule, setupDeviceInformationModuleApi };
