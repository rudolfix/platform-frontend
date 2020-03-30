import { notificationUIActions } from "./actions";
import { notificationUISaga } from "./sagas";

const MODULE_ID = "wallet:notification-ui";

const setupNotificationUIModule = () => ({
  id: MODULE_ID,
  sagas: [notificationUISaga],
  api: notificationUIModuleApi,
});

const notificationUIModuleApi = {
  actions: notificationUIActions,
};

export { setupNotificationUIModule, notificationUIModuleApi };
