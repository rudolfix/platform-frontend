import { setupBindings } from "./bindings";
import { symbols } from "./symbols";

const MODULE_ID = "notifications";

const setupNotificationsModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  api: notificationModuleApi,
});

const notificationModuleApi = {
  symbols,
};

export { setupNotificationsModule, notificationModuleApi };
