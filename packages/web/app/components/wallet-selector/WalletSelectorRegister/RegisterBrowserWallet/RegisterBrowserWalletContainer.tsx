import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { EWalletType } from "../../../../modules/web3/types";
import { WalletChooser } from "../../shared/WalletChooser";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

export type TWalletBrowserBaseExternalProps = {
  showWalletSelector: boolean | undefined;
  isLogin: boolean;
};

export type TWalletBrowserBaseProps = TWalletBrowserBaseExternalProps;

export const RegisterBrowserWalletContainer: React.FunctionComponent<TWalletBrowserBaseExternalProps> = ({
  showWalletSelector,
  children,
  isLogin,
}) => (
  <>
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        {isLogin ? (
          <FormattedMessage id="wallet-selector.login.metamask" />
        ) : (
          <FormattedMessage id="wallet-selector.sign-up.metamask" />
        )}
      </h1>
      <section className={styles.main}>
        <span className={styles.explanation}>
          <FormattedMessage id="wallet-selector.browser-wallet-provide-signature" />
        </span>
        {children}
        <p className={styles.help}>
          <FormattedHTMLMessage
            tagName="span"
            id="wallet-selector.browser-wallet.help"
            values={{ metamaskSupportLink: externalRoutes.metamaskSupportLink }}
          />
        </p>
      </section>
      {showWalletSelector && <WalletChooser isLogin={isLogin} activeWallet={EWalletType.BROWSER} />}
    </div>
  </>
);
