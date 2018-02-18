import { symbols } from "../../di/symbols";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { NotificationCenter } from "./NotificationCenter";

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
    [symbols.notificationCenter, symbols.appDispatch],
  );
}
