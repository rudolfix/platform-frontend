import { GetState } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import { TGlobalDependencies } from "./../../di/setupBindings";
import { IntlWrapper } from './../../lib/intl/IntlWrapper';
import { selectIsLightWallet } from "./selectors";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (
      dispatch: AppDispatch,
      getState: GetState,
      notificationCenter: NotificationCenter,
      intlWrapper: IntlWrapper ,
    ) => {
      dispatch(actions.web3.personalWalletDisconnected());

      const state = getState();
      const isLightWallet = selectIsLightWallet(state.web3);

      if (!isLightWallet) {
        notificationCenter.error(intlWrapper.intl.formatIntlMessage("modules.web3.flows.web3-error"));
      }
    },
    [symbols.appDispatch, symbols.getState, symbols.notificationCenter, symbols.intlWrapper],
  ),
};

// TODO: Change flow to saga