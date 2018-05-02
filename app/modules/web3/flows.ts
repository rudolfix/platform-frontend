import { GetState } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import { selectIsLightWallet } from "./selectors";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (dispatch: AppDispatch, getState: GetState, notificationCenter: NotificationCenter) => {
      dispatch(actions.web3.personalWalletDisconnected());

      const state = getState();
      const isLightWallet = selectIsLightWallet(state.web3);

      if (!isLightWallet) {
        notificationCenter.error("Web3 disconnected!");
      }
    },
    [symbols.appDispatch, symbols.getState, symbols.notificationCenter],
  ),
};
