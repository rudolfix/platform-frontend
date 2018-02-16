import { injectable } from "inversify";
import { toast } from "react-toastify";

export const NOTIFICATION_CENTER_SYMBOL = Symbol();

@injectable()
export class NotificationCenter {
  public error(message: string): void {
    toast.error(message);
  }
}
