export interface INotificationsProvider {
  subscribeForNotifications: () => Promise<unknown>;
  unsubscribeForNotifications: () => Promise<void>;
  getRegistrationToken: () => Promise<string | undefined>;
  deleteRegistrationToken: () => Promise<void>;
  refreshRegistrationToken: () => Promise<string>;
}
