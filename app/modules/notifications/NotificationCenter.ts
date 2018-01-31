import { injectable } from "inversify";
import { toast } from "react-toastify";

export const NotificationCenterSymbol = "NotificationCenter";

@injectable()
export class NotificationCenter {
  public error(message: string): void {
    toast.error(message);
  }
}
