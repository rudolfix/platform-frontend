import { withContainer } from "@neufund/shared";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/react-connected-components/OnEnterAction";
import { TMessage } from "../../../translatedMessages/utils";
import { WalletLoading } from "../../shared/WalletLoading";
import { RegisterBrowserWalletContainer } from "../../WalletSelectorRegister/RegisterBrowserWallet/RegisterBrowserWalletContainer";
import { BrowserWalletErrorBase } from "../../WalletSelectorRegister/RegisterBrowserWallet/RegisterBrowserWalletError";

export type TWalletBrowserProps = {
  errorMessage?: TMessage;
  isLoading: boolean;
  isMessageSigning: boolean;
};

export type TWalletBrowserDispatchProps = {
  tryConnectingWithBrowserWallet: () => void;
};

export const LoginBrowserWallet = compose(
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
  withContainer(RegisterBrowserWalletContainer),
  branch<TWalletBrowserProps>(
    ({ isLoading, isMessageSigning }) => isLoading || isMessageSigning,
    renderComponent(WalletLoading),
  ),
  branch<TWalletBrowserProps>(
    ({ errorMessage }) => errorMessage !== undefined,
    renderComponent(BrowserWalletErrorBase),
  ),
)(() => null);
