import { symbols } from "../../di/symbols";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import { NotificationCenter } from "../notifications/NotificationCenter";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (dispatch: AppDispatch, notificationCenter: NotificationCenter) => {
      dispatch(actions.web3.personalWalletDisconnected());
      notificationCenter.error("Web3 disconnected!");
    },
    [symbols.appDispatch, symbols.notificationCenter],
  ),
};
