import { Button, EButtonLayout } from "@neufund/design-system";
import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { selectIsMessageSigning } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { LoadingIndicator } from "../../shared/loading-indicator/index";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { TMessage } from "../../translatedMessages/utils";

import notificationSign from "../../../assets/img/notifications/warning.svg";
import * as styles from "./WalletBrowser.module.scss";

interface IWalletBrowserProps {
  errorMessage?: TMessage;
  isLoading: boolean;
  isMessageSigning: boolean;
}

interface IWalletBrowserDispatchProps {
  tryConnectingWithBrowserWallet: () => void;
}

type TMetamaskErrorProps = {
  errorMessage: TMessage;
  tryConnectingWithBrowserWallet: () => void;
};

export const WalletLoading = () => <LoadingIndicator className={styles.loadingIndicator} />;

export const MetamaskError: React.FunctionComponent<TMetamaskErrorProps> = ({
  errorMessage,
  tryConnectingWithBrowserWallet,
}) => (
  <>
    <div data-test-id="browser-wallet-error-msg" className={styles.notification}>
      <img src={notificationSign} alt="" />
      <span> {getMessageTranslation(errorMessage)} </span>
    </div>

    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={tryConnectingWithBrowserWallet}
      data-test-id="browser-wallet-init.try-again"
      className={styles.button}
    >
      <FormattedMessage id="common.try-again" />
    </Button>
  </>
);

export const WalletBrowserBase: React.FunctionComponent = ({ children }) => (
  <section className={styles.wrapper}>
    <FormattedMessage id="wallet-selector.browser-wallet-provide-signature" />
    {children}
    <p className={styles.help}>
      <FormattedHTMLMessage
        tagName="span"
        id="wallet-selector.browser-wallet.help"
        values={{ metamaskSupportLink: externalRoutes.metamaskSupportLink }}
      />
    </p>
  </section>
);

export const WalletBrowser = compose<React.FunctionComponent>(
  appConnect<IWalletBrowserProps, IWalletBrowserDispatchProps>({
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
  withContainer(WalletBrowserBase),
  branch<IWalletBrowserProps>(
    ({ isLoading, isMessageSigning }) => isLoading || isMessageSigning,
    renderComponent(WalletLoading),
  ),
  branch<IWalletBrowserProps>(
    ({ errorMessage }) => errorMessage !== undefined,
    renderComponent(MetamaskError),
  ),
)(() => null);
