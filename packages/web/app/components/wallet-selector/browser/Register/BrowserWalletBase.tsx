import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { EWalletType } from "../../../../modules/web3/types";
import { WalletChooser } from "../../WalletChooser";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

export type TWalletBrowserBaseProps = {
  rootPath: string,
  showWalletSelector: boolean
}

export const BrowserWalletBase: React.FunctionComponent<TWalletBrowserBaseProps> = ({
  rootPath,
  showWalletSelector,
  children
}) =>
  (
    <>
      <div className={styles.wrapper} data-test-id="wallet-selector">
        <h1 className={styles.title}>
          <FormattedMessage id="wallet-selector.sign-up" />
        </h1>
        <section className={styles.main}>
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
        {showWalletSelector && (
          <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />
        )}
      </div>

    </>
  );
