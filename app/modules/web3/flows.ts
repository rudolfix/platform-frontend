import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import {
  NOTIFICATION_CENTER_SYMBOL,
  NotificationCenter,
} from "../notifications/NotificationCenter";
import { personalWalletDisconnectedPlainAction } from "./actions";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (dispatch: AppDispatch, notificationCenter: NotificationCenter) => {
      dispatch(personalWalletDisconnectedPlainAction());
      notificationCenter.error("Web3 disconnected!");
    },
    [APP_DISPATCH_SYMBOL, NOTIFICATION_CENTER_SYMBOL],
  ),
};
