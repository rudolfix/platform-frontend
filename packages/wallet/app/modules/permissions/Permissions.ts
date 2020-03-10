import { requestNotifications } from "react-native-permissions";
import { injectable } from "inversify";
export type PermissionStatus = "unavailable" | "denied" | "blocked" | "granted";

export interface NotificationSettings {
  // properties only availables on iOS
  // unavailable settings will not be included in the response object
  alert?: boolean;
  badge?: boolean;
  sound?: boolean;
  lockScreen?: boolean;
  carPlay?: boolean;
  notificationCenter?: boolean;
  criticalAlert?: boolean;
}

export type NotificationsPermissions = {
  status: PermissionStatus;
  settings: NotificationSettings;
};

@injectable()
export class Permissions {
  requestNotificationsPermissions(): Promise<{
    status: PermissionStatus;
    settings: NotificationSettings;
  }> {
    return requestNotifications([]);
  }
}
