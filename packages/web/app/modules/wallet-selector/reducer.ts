import { AppReducer } from "../../store";
import { actions } from "../actions";
import { EWalletType } from "../web3/types";
import { ECommonWalletRegistrationFlowState, IWalletSelectorState, TWalletRegisterData } from "./types";

const walletSelectorInitialState: IWalletSelectorState & TWalletRegisterData = {
  isMessageSigning: false,
  messageSigningError: undefined,
  isLoading: false,

  walletType: EWalletType.LIGHT,
  walletState: ECommonWalletRegistrationFlowState.NOT_STARTED,

};

// TODO merge error fields, make one enum for all signer/wallet related errors
export const walletSelectorReducer: AppReducer<IWalletSelectorState & TWalletRegisterData> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState &  TWalletRegisterData => {
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
        walletState: ECommonWalletRegistrationFlowState.NOT_STARTED,
      };
    //backwards compatibility only
      case actions.walletSelector.browserWalletConnectionError.getType():
      return {
        isMessageSigning: false,
        messageSigningError: action.payload.errorMsg,
        isLoading: false,
        walletType: state.walletType,
        walletState: ECommonWalletRegistrationFlowState.NOT_STARTED,
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
