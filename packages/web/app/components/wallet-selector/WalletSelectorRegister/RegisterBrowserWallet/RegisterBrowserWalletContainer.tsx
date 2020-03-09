import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { selectIsLoginRoute } from "../../../../modules/wallet-selector/selectors";
import { EWalletType } from "../../../../modules/web3/types";
import { appConnect } from "../../../../store";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";
import { WalletChooser } from "../../shared/WalletChooser";

export type TWalletBrowserBaseProps = {
  rootPath: string;
  showWalletSelector: boolean;
  isLoginRoute: boolean;
};

export const RegisterBrowserWalletContainerComponent: React.FunctionComponent<TWalletBrowserBaseProps> = ({
  rootPath,
  showWalletSelector,
  children,
  isLoginRoute,
}) => (
  <>
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        {isLoginRoute ? (
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
      {showWalletSelector && (
        <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />
      )}
    </div>
  </>
);

export const RegisterBrowserWalletContainer = appConnect({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(RegisterBrowserWalletContainerComponent);
