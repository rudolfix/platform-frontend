import { DeepReadonly } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";
import { AppReducer } from "../../store";
import { actions } from "../actions";

export enum EBrowserWalletState {
  BROWSER_WALLET_LOADING = "browserWalletLoading",
  BROWSER_WALLET_ERROR = "browserWalletError",
}


export type TWalletRegisterData = ({
    showWalletSelector: boolean;
    rootPath: string;
  } &
    ({ browserWalletState: EBrowserWalletState.BROWSER_WALLET_ERROR, errorMessage: TMessage } | { browserWalletState: EBrowserWalletState.BROWSER_WALLET_LOADING }))
  | undefined

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;
  data: TWalletRegisterData
}

const walletSelectorInitialState: IWalletSelectorState = {
  isMessageSigning: false,
  messageSigningError: undefined,
  isLoading: false,
  data: undefined
};

// TODO merge error fields, make one enum for all signer/wallet related errors
export const walletSelectorReducer: AppReducer<IWalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState => {
  switch (action.type) {
    case actions.walletSelector.tryConnectingWithBrowserWallet.getType():
      console.log("walletSelectorReducer")
      return {
        ...walletSelectorInitialState,
        isLoading: true,
      };
    case actions.walletSelector.messageSigning.getType():
      return {
        isMessageSigning: true,
        messageSigningError: undefined,
        isLoading: false,
        data: undefined
      };
    case actions.walletSelector.browserWalletConnectionError.getType():
      return {
        isMessageSigning: false,
        messageSigningError: action.payload.errorMsg,
        isLoading: false,
        data: undefined
      };
    case actions.walletSelector.messageSigningError.getType():
      console.log("walletSelectorReducer messageSigningError")
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: action.payload.errorMessage,
        isLoading: false,
      };
    case actions.walletSelector.reset.getType():
      return {
        ...walletSelectorInitialState,
      };

    case actions.walletSelector.setWalletRegisterData.getType():
      console.log("walletSelectorReducer setWalletRegisterData")
      return {
        ...state,
        data: action.payload.data
      }
  }

  return state;
};
