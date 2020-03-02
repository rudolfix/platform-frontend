import { DeepReadonly } from "@neufund/shared";

import { TMessage } from "../../components/translatedMessages/utils";
import { AppReducer } from "../../store";
import { actions } from "../actions";
import { EWalletType } from "../web3/types";

export enum EBrowserWalletState {
  NOT_STARTED = "notStarted",
  BROWSER_WALLET_ASK_FOR_EMAIL = "browserWalletAskForEmail",
  BROWSER_WALLET_VERIFYING_EMAIL = "browserWalletVerifyingEmail",
  BROWSER_WALLET_EMAIL_VERIFICATION_ERROR = "browserWalletEmailVerificationError",
  BROWSER_WALLET_LOADING = "browserWalletLoading",
  BROWSER_WALLET_SIGNING = "browserWalletSigning",
  BROWSER_WALLET_ERROR = "browserWalletError",
}

export type TFormValues = {
  tos: boolean;
  email: string;
}

export type TBrowserWalletRegisterReadyData = (
  {
    showWalletSelector: boolean;
    rootPath: string;
    defaultFormValues: TFormValues
  } &
  ({ browserWalletState: EBrowserWalletState.BROWSER_WALLET_ERROR, errorMessage: TMessage } |
    { browserWalletState: EBrowserWalletState.BROWSER_WALLET_LOADING } |
    { browserWalletState: EBrowserWalletState.BROWSER_WALLET_SIGNING } |
    { browserWalletState: EBrowserWalletState.BROWSER_WALLET_ASK_FOR_EMAIL } |
    { browserWalletState: EBrowserWalletState.BROWSER_WALLET_VERIFYING_EMAIL } |
    { browserWalletState: EBrowserWalletState.BROWSER_WALLET_EMAIL_VERIFICATION_ERROR, errorMessage: TMessage }
    )
  )

export type TBrowserWalletRegisterData =TBrowserWalletRegisterReadyData |
  ({ browserWalletState: EBrowserWalletState.NOT_STARTED, defaultFormValues: TFormValues })

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;

  walletType: EWalletType
}

const formInitialState = {
  email: "",
  tos: false
};

const walletSelectorInitialState: IWalletSelectorState & TBrowserWalletRegisterData = {
  isMessageSigning: false,
  messageSigningError: undefined,
  isLoading: false,

  walletType: EWalletType.LIGHT,
  browserWalletState: EBrowserWalletState.NOT_STARTED,
  defaultFormValues: formInitialState

};

// TODO merge error fields, make one enum for all signer/wallet related errors
export const walletSelectorReducer: AppReducer<IWalletSelectorState & TBrowserWalletRegisterData> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState &  TBrowserWalletRegisterData => {
  switch (action.type) {
    //backwards compatibility only
    case actions.walletSelector.tryConnectingWithBrowserWallet.getType():
      return {
        ...walletSelectorInitialState,
        isLoading: true,
      };
    //backwards compatibility only
      case actions.walletSelector.messageSigning.getType():
      return {
        isMessageSigning: true,
        messageSigningError: undefined,
        isLoading: false,
        walletType: state.walletType,
        browserWalletState: EBrowserWalletState.NOT_STARTED,
        defaultFormValues: formInitialState
      };
    //backwards compatibility only
      case actions.walletSelector.browserWalletConnectionError.getType():
      return {
        isMessageSigning: false,
        messageSigningError: action.payload.errorMsg,
        isLoading: false,
        walletType: state.walletType,
        browserWalletState: EBrowserWalletState.NOT_STARTED,
        defaultFormValues: formInitialState
      };
    //backwards compatibility only
      case actions.walletSelector.messageSigningError.getType():
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: action.payload.errorMessage,
        isLoading: false,
      };
    //backwards compatibility only
    case actions.walletSelector.reset.getType():
      return {
        ...walletSelectorInitialState,
      };
    case actions.walletSelector.setWalletRegisterData.getType():
      return {
        ...state,
        ...action.payload.data
      }
  }

  return state;
};
