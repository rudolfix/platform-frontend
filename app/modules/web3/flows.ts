import { APP_DISPATCH_SYMBOL } from "../../getContainer";
import { injectableFn } from "../../redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import {
  NOTIFICATION_CENTER_SYMBOL,
  NotificationCenter,
} from "../notifications/NotificationCenter";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (dispatch: AppDispatch, notificationCenter: NotificationCenter) => {
      dispatch(actions.web3.personalWalletDisconnected());
      notificationCenter.error("Web3 disconnected!");
    },
    [APP_DISPATCH_SYMBOL, NOTIFICATION_CENTER_SYMBOL],
  ),
};
