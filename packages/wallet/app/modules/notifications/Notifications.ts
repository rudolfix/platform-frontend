import { inject, injectable } from "inversify";
import { INotificationsProvider } from "./INotificationsProvider";
import { symbols } from "./symbols";
import { symbols as globalSymbols } from "../../di/symbols";
import { NotificationsPermissions, Permissions } from "../permissions/Permissions";

@injectable()
export class Notifications {
  private readonly notificationsProvider: INotificationsProvider;
  private readonly permissions: Permissions;
  private notificationsAllowed: NotificationsPermissions | null;

  constructor(
    @inject(symbols.notificationsProvider) notificationsProvider: INotificationsProvider,
    @inject(globalSymbols.permissions) permissions: Permissions,
  ) {
    this.notificationsProvider = notificationsProvider;
    this.permissions = permissions;
    this.notificationsAllowed = null;
  }

  async init() {
    this.notificationsAllowed = await this.permissions.requestNotificationsPermissions();

    if (this.notificationsAllowed.status === "granted") {
      await this.notificationsProvider.subscribeForNotifications();
    }
  }
}
