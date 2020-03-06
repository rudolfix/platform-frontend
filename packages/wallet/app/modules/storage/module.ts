import { setupBindings } from "./bindings";
import { symbols } from "./index";

const MODULE_ID = "storage";

const setupStorageModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  api: storageModuleApi,
});

const storageModuleApi = {
  symbols,
};

export { setupStorageModule, storageModuleApi };
