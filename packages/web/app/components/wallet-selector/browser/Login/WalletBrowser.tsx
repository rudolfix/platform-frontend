import {  withContainer } from "@neufund/shared";
import { branch, renderComponent } from "recompose";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { TMessage } from "../../../translatedMessages/utils";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { BrowserWalletErrorBase } from "../Register/RegisterBrowserWalletError";
import { RegisterBrowserWalletBase } from "../Register/RegisterBrowserWalletBase";
import { WalletLoading } from "../../shared/WalletLoading";

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
  withContainer(RegisterBrowserWalletBase),
  branch<TWalletBrowserProps>(
    ({ isLoading, isMessageSigning }) => isLoading || isMessageSigning,
    renderComponent(WalletLoading),
  ),
  branch<TWalletBrowserProps>(
    ({ errorMessage }) => errorMessage !== undefined,
    renderComponent(BrowserWalletErrorBase),
  ),
)(() => null);
