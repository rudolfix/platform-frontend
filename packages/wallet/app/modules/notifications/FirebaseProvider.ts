import { inject, injectable } from "inversify";
import messaging from "@react-native-firebase/messaging";
import { INotificationsProvider } from "./INotificationsProvider";
import { symbols as globalSymbols } from "../../di/symbols";
import { ILogger } from "@neufund/shared-modules";

@injectable()
class FirebaseProvider implements INotificationsProvider {
  private readonly app: any;
  private readonly logger: ILogger;

  constructor(@inject(globalSymbols.logger) logger: ILogger) {
    this.app = messaging();
    this.logger = logger;
  }

  async subscribeForNotifications(): Promise<void> {
    this.logger.info("Subscribe for remote notifications");

    return this.app.registerForRemoteNotifications();
  }

  async unsubscribeForNotifications(): Promise<void> {
    this.logger.info("Unsubscribe for remote notifications");

    return this.app.unregisterForRemoteNotifications();
  }

  async getRegistrationToken(): Promise<string> {
    this.logger.info("Get registration token");

    return this.app.getToken();
  }

  async deleteRegistrationToken(): Promise<void> {
    this.logger.info("Delete registration token");

    return this.app.deleteToken();
  }

  async refreshRegistrationToken(): Promise<string> {
    this.logger.info("Refresh registration token");

    await this.deleteRegistrationToken();

    const newRegistrationToken = await this.getRegistrationToken();
    return newRegistrationToken;
  }

  onTokenRefresh(listener: (token: string) => any) {
    this.app.onTokenRefresh(listener);
  }
}

export { FirebaseProvider };
