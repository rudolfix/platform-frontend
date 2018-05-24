import { GetState } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { IntlWrapper } from "../../lib/intl/IntlWrapper";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";
import { selectWalletType } from "./selectors";
import { WalletType } from "./types";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (
      dispatch: AppDispatch,
      getState: GetState,
      notificationCenter: NotificationCenter,
      intlWrapper: IntlWrapper,
    ) => {
      dispatch(actions.walletSelector.reset());
      dispatch(actions.walletSelector.ledgerReset());
      dispatch(actions.web3.personalWalletDisconnected());

      const state = getState();
      const walletType = selectWalletType(state.web3);
      let error = "";

      switch (walletType) {
        case WalletType.BROWSER:
          error = intlWrapper.intl.formatIntlMessage("modules.web3.flows.web3-error.browser");
          break;
        case WalletType.LEDGER:
          error = intlWrapper.intl.formatIntlMessage("modules.web3.flows.web3-error.ledger");
          break;
        default:
          return;
      }

      notificationCenter.error(error);
    },
    [symbols.appDispatch, symbols.getState, symbols.notificationCenter, symbols.intlWrapper],
  ),
};

// TODO: Change flow to saga
