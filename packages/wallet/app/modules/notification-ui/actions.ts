import { createActionFactory } from "@neufund/shared";

export const notificationUIActions = {
  showInfo: createActionFactory("NOTIFICATION_UI_SHOW_INFO", (message: string) => ({
    message,
  })),
  showError: createActionFactory("NOTIFICATION_UI_SHOW_ERROR", (message: string) => ({
    message,
  })),
};
