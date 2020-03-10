import { inject, injectable } from "inversify";
import { INotificationsProvider } from "./INotificationsProvider";
import { symbols } from "./symbols";
import { symbols as globalSymbols } from "../../di/symbols";
import {
  NotificationsPermissions,
  Permissions,
  permissionsStatuses,
} from "../permissions/Permissions";
import { ILogger } from "@neufund/shared-modules";
import { AppError } from "../../classes/AppError";
import { Notification, Notifications as NotificationsHandler } from "react-native-notifications";
import { NotificationResponse } from "react-native-notifications/lib/src/interfaces/NotificationEvents";
import { EventsRegistry } from "react-native-notifications/lib/dist/events/EventsRegistry";

class NotificationsError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

@injectable()
export class Notifications {
  private readonly notificationsProvider: INotificationsProvider;
  private readonly permissions: Permissions;
  private readonly logger: ILogger;
  private notificationsAllowed: NotificationsPermissions | null;
  private events: EventsRegistry | null;

  constructor(
    @inject(symbols.notificationsProvider) notificationsProvider: INotificationsProvider,
    @inject(globalSymbols.permissions) permissions: Permissions,
    @inject(globalSymbols.logger) logger: ILogger,
  ) {
    this.notificationsProvider = notificationsProvider;
    this.permissions = permissions;
    this.logger = logger;
    this.notificationsAllowed = null;
    this.events = null;

    this.logger.info("Setup push notifications");
  }

  async init() {
    this.logger.info("Init push notifications");

    try {
      this.notificationsAllowed = await this.permissions.requestNotificationsPermissions();
      this.events = NotificationsHandler.events();
    } catch (e) {
      throw new NotificationsError(e);
    }

    // only subscribe to notification provider if notifications are allowed
    if (this.notificationsAllowed.status === permissionsStatuses.granted) {
      try {
        await this.notificationsProvider.subscribeForNotifications();

        // temp testing token request; TODO: remove after test
        const token = await this.notificationsProvider.getRegistrationToken();
        console.log("--------------token---------", token);
      } catch (e) {
        throw new NotificationsError(e);
      }
    }
  }

  onReceivedNotificationInForeground(listener: (notification: Notification) => any) {
    if (!this.events) return;

    this.events.registerNotificationReceivedForeground((notification: Notification, completion) => {
      this.logger.info("Notification received in foreground");

      listener(notification);
      completion({ alert: false, sound: false, badge: false });
    });
  }

  onReceiveNotificationIndBackground(listener: (notification: Notification) => any) {
    if (!this.events) return;

    this.events.registerNotificationReceivedBackground((notification: Notification, completion) => {
      this.logger.info("Notification received in background");

      listener(notification);
      completion({ alert: false, sound: false, badge: false });
    });
  }

  onNotificationOpened(listener: (notification: NotificationResponse) => void) {
    if (!this.events) return;

    this.events.registerNotificationOpened(
      (notification: NotificationResponse, completion: () => void) => {
        this.logger.info("Notification opened");

        listener(notification);
        completion();
      },
    );
  }

  postLocalNotification(notification: Notification, id: number) {
    return NotificationsHandler.postLocalNotification(notification, id);
  }
}
