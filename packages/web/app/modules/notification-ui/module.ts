import { notificationUIActions } from "@neufund/shared-modules";
import { notificationUISaga } from "./sagas";

const MODULE_ID = "web:notification-ui";

const setupNotificationUIModule = () => ({
  id: MODULE_ID,
  sagas: [notificationUISaga],
  api: notificationUIModuleApi,
});

const notificationUIModuleApi = {
  actions: notificationUIActions,
};

export { setupNotificationUIModule, notificationUIModuleApi };
