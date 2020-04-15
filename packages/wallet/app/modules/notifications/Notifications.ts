import { inject, injectable } from "inversify";
import { INotificationsProvider } from "./INotificationsProvider";
import { symbols } from "./symbols";
import { symbols as globalSymbols } from "../../di/symbols";
import { Permissions } from "../permissions/Permissions";
import { ILogger } from "@neufund/shared-modules";
import { AppError } from "../../classes/AppError";
import {
  Notification,
  NotificationResponse,
  Notifications as NotificationsHandler,
} from "react-native-notifications";
import { EventsRegistry } from "react-native-notifications/lib/dist/events/EventsRegistry";
import { DeviceInformation } from "../device-information/DeviceInformation";
import { NotificationCompletion } from "react-native-notifications/lib/dist/interfaces/NotificationCompletion";
import { permissionsModuleApi } from "../permissions/module";
import { setupDeviceInformationModuleApi } from "../device-information/module";
import { NotificationsResponse, RESULTS } from "react-native-permissions";

class NotificationsError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * @class Notifications
 * Class to manage push notifications.
 * @note Manages push notifications subscription, tokens, events.
 *
 */
@injectable()
export class Notifications {
  private readonly notificationsProvider: INotificationsProvider;
  private readonly permissions: Permissions;
  private readonly logger: ILogger;
  private readonly deviceInformation: DeviceInformation;
  private notificationsAllowed: NotificationsResponse | null;
  private events: EventsRegistry | null;

  constructor(
    @inject(symbols.notificationsProvider) notificationsProvider: INotificationsProvider,
    @inject(permissionsModuleApi.symbols.permissions) permissions: Permissions,
    @inject(globalSymbols.logger) logger: ILogger,
    @inject(setupDeviceInformationModuleApi.symbols.deviceInformation)
    deviceInformation: DeviceInformation,
  ) {
    this.notificationsProvider = notificationsProvider;
    this.permissions = permissions;
    this.logger = logger;
    this.deviceInformation = deviceInformation;
    this.notificationsAllowed = null;
    this.events = null;

    this.logger.info("Setup push notifications");
  }

  /**
   * @method init
   * Initializes push notifications
   * @note this method will ask for a push notifications permission, register in firebase and sync with backend.
   */
  async init() {
    this.logger.info("Init push notifications");
    try {
      this.notificationsAllowed = await this.permissions.requestNotificationsPermissions();
      this.events = NotificationsHandler.events();
    } catch (e) {
      throw new NotificationsError(e);
    }

    // only subscribe to notification provider if notifications are allowed
    if (this.notificationsAllowed.status === RESULTS.GRANTED) {
      try {
        await this.notificationsProvider.subscribeForNotifications();
        await this.registerTokenWithBackend();
      } catch (e) {
        throw new NotificationsError(e.message);
      }
    }
  }

  /**
   * @event onReceivedNotificationInForeground
   * Fires when notification is received in foreground (the application is currently open).
   * @param {function} listener Callback function to call when a notification is received
   * @param {NotificationCompletion} notificationShowSettings Settings around how to show notification, badge, sound etc.
   */
  onReceivedNotificationInForeground(
    listener: (notification: Notification) => any,
    notificationShowSettings: NotificationCompletion,
  ) {
    if (!this.events) return;

    return this.events.registerNotificationReceivedForeground(
      (notification: Notification, completion) => {
        this.logger.info("Notification received in foreground");
        listener(notification);
        completion(notificationShowSettings);
      },
    );
  }

  /**
   * @event onReceiveNotificationInBackground
   * Fires when notification is received in background (the application is closed).
   * @note A notification will be shown in a system specific way, e.g. locks screen, notifications screen etc.
   * @param {function} listener Callback function to call when a notification is received.
   * @param {NotificationCompletion} notificationShowSettings Settings around how to show notification, badge, sound etc.
   */
  onReceiveNotificationInBackground(
    listener: (notification: Notification) => any,
    notificationShowSettings: NotificationCompletion,
  ) {
    if (!this.events) return;

    return this.events.registerNotificationReceivedBackground(
      (notification: Notification, completion) => {
        this.logger.info("Notification received in background");

        listener(notification);
        completion(notificationShowSettings);
      },
    );
  }

  /**
   * @event onNotificationOpened
   * Fires when use taps on a system notification.
   * @param {function} listener Callback function to call when a notification is opened
   */
  onNotificationOpened(listener: (notification: NotificationResponse) => void) {
    if (!this.events) return;

    return this.events.registerNotificationOpened(
      (notification: NotificationResponse, completion: () => void) => {
        this.logger.info("Notification opened");

        listener(notification);
        completion();
      },
    );
  }

  /**
   * @method registerTokenWithBackend
   * Register a notification provider token in a backend service.
   */
  async registerTokenWithBackend() {
    //TODO replace the mocked call to BE with a proper HTTP client. Check the ticket https://github.com/Neufund/platform-frontend/issues/4202
    this.logger.info("Try register");
    const token = await this.notificationsProvider.getRegistrationToken();
    const deviceId = await this.deviceInformation.getUniqueId();
    const platform = this.deviceInformation.getPlatform();

    this.logger.info(`Registering token: ${token} for device: ${deviceId} on platform ${platform}`);
  }

  /**
   * @method unregisterTokenFromBackend
   * Unregister a notification provider token in a backend service. Should be called when a new user logs in.
   */
  async unregisterTokenFromBackend() {
    //TODO replace the mocked call to BE with a proper HTTP client. Check the ticket https://github.com/Neufund/platform-frontend/issues/4202
    /*
    const token = await this.notificationsProvider.getRegistrationToken();
    const jwtToken = Config.NF_JWT;
    */
  }

  /**
   * @method postLocalNotification
   * Post a local notification.
   * @param {Notification} notification A notification to send.
   * @note Local notification never leave the device and used fow a user interaction.
   */
  postLocalNotification(notification: Notification, id: number) {
    return NotificationsHandler.postLocalNotification(notification, id);
  }
}
