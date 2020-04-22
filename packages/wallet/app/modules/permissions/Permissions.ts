import { NotificationsResponse, requestNotifications } from "react-native-permissions";
import { inject, injectable } from "inversify";
import { symbols as globalSymbols } from "../../di/symbols";
import { ILogger } from "@neufund/shared-modules";

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
  requestNotificationsPermissions(): Promise<NotificationsResponse> {
    this.logger.info("Request for push notification permissions");

    return requestNotifications([]);
  }
}
