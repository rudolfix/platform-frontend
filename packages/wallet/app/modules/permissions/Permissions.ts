import { coreModuleApi, ILogger } from "@neufund/shared-modules";
import { inject, injectable } from "inversify";
import {
  NotificationsResponse,
  requestNotifications,
  check,
  PermissionStatus,
  Permission,
  request,
} from "react-native-permissions";

/**
 * @class Permissions
 * Class to manage (request) device permissions e.g. camera, push notifications, location etc.
 * @note to add more permissions follow https://github.com/react-native-community/react-native-permissions
 *
 */
@injectable()
export class Permissions {
  private readonly logger: ILogger;
  constructor(@inject(coreModuleApi.symbols.logger) logger: ILogger) {
    this.logger = logger;

    this.logger.info("Setup permissions module");
  }

  /**
   * @method requestNotificationsPermissions
   * Request push notifications permission
   * @note show platform specific confirmation dialog for a permission request.
   * @returns {Promise} NotificationsPermissions
   */
  requestNotificationsPermissions(): Promise<NotificationsResponse> {
    this.logger.info("Request for push notification permissions");

    return requestNotifications([]);
  }

  async check(permission: Permission): Promise<PermissionStatus> {
    this.logger.info(`Checking for permission ${permission.toString()}`);

    const result = await check(permission);

    this.logger.info(`Permission ${permission.toString()} status is ${result}`);

    return result;
  }

  async request(permission: Permission): Promise<PermissionStatus> {
    this.logger.info(`Requesting permission ${permission.toString()}`);

    const result = await request(permission);

    this.logger.info(`Permission ${permission.toString()} status after request is ${result}`);

    return result;
  }
}
