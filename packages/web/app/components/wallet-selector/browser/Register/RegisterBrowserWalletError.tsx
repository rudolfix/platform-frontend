import { compose } from "recompose";
import * as React from "react";

import { appConnect } from "../../../../store";
import { actions } from "../../../../modules/actions";
import notificationSign from "../../../../assets/img/notifications/warning.svg";
import { getMessageTranslation } from "../../../translatedMessages/messages";
import { Button, EButtonLayout } from "../../../../../../design-system/dist/components/buttons/Button";
import { TMessage } from "../../../translatedMessages/utils";
import { FormattedMessage } from "react-intl-phraseapp";
import { TWalletBrowserDispatchProps, TWalletBrowserProps } from "../Login/WalletBrowser";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

type TBrowserWalletErrorProps = {
  errorMessage: TMessage;
  tryConnectingWithBrowserWallet: () => void;
};

export const BrowserWalletErrorBase: React.FunctionComponent<TBrowserWalletErrorProps> = ({
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

export const RegisterBrowserWalletError = compose<TBrowserWalletErrorProps,TBrowserWalletErrorProps>(
  appConnect<TWalletBrowserProps, TWalletBrowserDispatchProps>({
    dispatchToProps: dispatch => ({
      tryConnectingWithBrowserWallet: () => {
        dispatch(actions.walletSelector.browserWalletSignMessage());
      },
    }),
  }),
)( BrowserWalletErrorBase);
