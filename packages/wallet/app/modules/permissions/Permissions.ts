import { requestNotifications } from "react-native-permissions";
import { inject, injectable } from "inversify";
import { symbols as globalSymbols } from "../../di/symbols";
import { ILogger } from "@neufund/shared-modules";

export enum permissionsStatuses {
  unavailable = "unavailable",
  denied = "denied",
  blocked = "blocked",
  granted = "granted",
}

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

/**
 * @class Permissions
 * Class to manage (request) device permissions e.g. camera, push notifications, location etc.
 * @note to add more permissions follow https://github.com/react-native-community/react-native-permissions
 *
 */
@injectable()
export class Permissions {
  private readonly logger: ILogger;
  constructor(@inject(globalSymbols.logger) logger: ILogger) {
    this.logger = logger;

    this.logger.info("Setup permissions module");
  }

  /**
   * @method requestNotificationsPermissions
   * Request push notifications permission
   * @note show platform specific confirmation dialog for a permission request.
   * @returns {Promise} NotificationsPermissions
   */
  requestNotificationsPermissions(): Promise<NotificationsPermissions> {
    this.logger.info("Request for push notification permissions");

    return requestNotifications([]);
  }
}
