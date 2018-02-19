import { injectable } from "inversify";
import { toast } from "react-toastify";

@injectable()
export class NotificationCenter {
  public error(message: string): void {
    toast.error(message);
  }
}
