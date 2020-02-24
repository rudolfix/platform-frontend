import { DeepReadonly } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";
import { AppReducer } from "../../store";
import { actions } from "../actions";

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;
}

const walletSelectorInitialState: IWalletSelectorState = {
  isMessageSigning: false,
  messageSigningError: undefined,
  isLoading: false,
};

// TODO merge error fields, make one enum for all signer/wallet related errors
export const walletSelectorReducer: AppReducer<IWalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState => {
  switch (action.type) {
    case actions.walletSelector.tryConnectingWithBrowserWallet.getType():
      return {
        ...walletSelectorInitialState,
        isLoading: true,
      };
    case actions.walletSelector.messageSigning.getType():
      return {
        isMessageSigning: true,
        messageSigningError: undefined,
        isLoading: false,
      };
    case actions.walletSelector.browserWalletConnectionError.getType():
      return {
        isMessageSigning: false,
        messageSigningError: action.payload.errorMsg,
        isLoading: false,
      };
    case actions.walletSelector.messageSigningError.getType():
      return {
        isMessageSigning: false,
        messageSigningError: action.payload.errorMessage,
        isLoading: false,
      };
    case actions.walletSelector.reset.getType():
      return {
        ...walletSelectorInitialState,
      };
  }

  return state;
};
