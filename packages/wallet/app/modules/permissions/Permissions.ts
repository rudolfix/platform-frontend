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

@injectable()
export class Permissions {
  private readonly logger: ILogger;
  constructor(@inject(globalSymbols.logger) logger: ILogger) {
    this.logger = logger;

    this.logger.info("Setup permissions module");
  }
  requestNotificationsPermissions(): Promise<{
    status: PermissionStatus;
    settings: NotificationSettings;
  }> {
    this.logger.info("Request for push notification permissions");
    return requestNotifications([]);
  }
}
