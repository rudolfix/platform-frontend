import { injectable } from "inversify";
import { showErrorToast, showInfoToast } from "../../components/shared/Toast";

@injectable()
export class NotificationCenter {
  public error(message: string): void {
    showErrorToast(message);
  }
  public info(message: string): void {
    showInfoToast(message);
  }
}
