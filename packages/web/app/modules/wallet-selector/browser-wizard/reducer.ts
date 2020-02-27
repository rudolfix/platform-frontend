import { DeepReadonly } from "@neufund/shared";

import { TMessage } from "../../../components/translatedMessages/utils";
import { AppReducer } from "../../../store";
import { actions } from "../../actions";

export interface IBrowserWalletWizardState {
  errorMsg: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;
  approvalRejected: boolean;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {
  errorMsg: undefined,
  isLoading: false,
  approvalRejected: false,
};

// TODO merge this to walletSelector reducer
export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case actions.walletSelector.tryConnectingWithBrowserWallet.getType():
      console.log("browserWalletWizardReducer")
      return {
        ...browserWalletWizardInitialState,
        isLoading: true,
      };
    case actions.walletSelector.browserWalletConnectionError.getType():
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case actions.walletSelector.browserWalletAccountApprovalRejectedError.getType():
      return {
        ...state,
        isLoading: false,
        approvalRejected: true,
      };

    default:
      return state;
  }
};
