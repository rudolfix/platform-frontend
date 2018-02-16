import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { NOTIFICATION_CENTER_SYMBOL, NotificationCenter } from "./NotificationCenter";

export function notifyOnErrorAction(action: Function): Function {
  return injectableFn(
    async (notificationCenter: NotificationCenter, dispatch: AppDispatch) => {
      try {
        // tslint:disable-next-line
        await dispatch(action);
      } catch (e) {
        notificationCenter.error(e.message);
      }
    },
    [NOTIFICATION_CENTER_SYMBOL, APP_DISPATCH_SYMBOL],
  );
}
