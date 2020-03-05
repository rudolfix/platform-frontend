import {  withContainer } from "@neufund/shared";
import { branch,compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { TMessage } from "../../../translatedMessages/utils";
import { WalletLoading } from "../../shared/WalletLoading";
import { BrowserWalletBase } from "../Register/BrowserWalletBase";
import { BrowserWalletErrorBase } from "../Register/RegisterBrowserWalletError";

export type TWalletBrowserProps = {
  errorMessage?: TMessage;
  isLoading: boolean;
  isMessageSigning: boolean;
}

export type TWalletBrowserDispatchProps  = {
  tryConnectingWithBrowserWallet: () => void;
}

export const WalletBrowser = compose(
  appConnect<TWalletBrowserProps, TWalletBrowserDispatchProps>({
    stateToProps: state => ({
      errorMessage: state.walletSelector.messageSigningError as TMessage,
      isLoading: state.walletSelector.isLoading,
      isMessageSigning: selectIsMessageSigning(state),
    }),
    dispatchToProps: dispatch => ({
      tryConnectingWithBrowserWallet: () => {
        dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
      },
      cancelSigning: () => {
        dispatch(actions.walletSelector.reset());
      },
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.walletSelector.tryConnectingWithBrowserWallet());
    },
  }),
  withContainer(BrowserWalletBase),
  branch<TWalletBrowserProps>(
    ({ isLoading, isMessageSigning }) => isLoading || isMessageSigning,
    renderComponent(WalletLoading),
  ),
  branch<TWalletBrowserProps>(
    ({ errorMessage }) => errorMessage !== undefined,
    renderComponent(BrowserWalletErrorBase),
  ),
)(() => null);
