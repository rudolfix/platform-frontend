import { injectable } from "inversify";
import messaging from "@react-native-firebase/messaging";
import { INotificationsProvider } from "./INotificationsProvider";

@injectable()
class FirebaseProvider implements INotificationsProvider {
  private readonly app: any;

  constructor() {
    this.app = messaging();
  }

  async subscribeForNotifications(): Promise<void> {
    return this.app.registerForRemoteNotifications();
  }

  async unsubscribeForNotifications(): Promise<void> {
    return this.app.unregisterForRemoteNotifications();
  }

  async getRegistrationToken(): Promise<string> {
    return this.app.getToken();
  }

  async deleteRegistrationToken(): Promise<void> {
    return this.app.deleteToken();
  }

  async refreshRegistrationToken(): Promise<string> {
    await this.deleteRegistrationToken();
    const newRegistrationToken = await this.getRegistrationToken();
    return newRegistrationToken;
  }
}

export { FirebaseProvider };
