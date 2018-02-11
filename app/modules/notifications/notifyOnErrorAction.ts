import { DispatchSymbol } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { NotificationCenter, NotificationCenterSymbol } from "./NotificationCenter";

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
    [NotificationCenterSymbol, DispatchSymbol],
  );
}
