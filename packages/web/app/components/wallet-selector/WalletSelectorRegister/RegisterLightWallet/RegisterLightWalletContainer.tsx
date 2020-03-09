import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EWalletType } from "../../../../modules/web3/types";
import { WalletChooser } from "../../shared/WalletChooser";
import { TStateProps } from "./RegisterLightWallet";

import * as styles from "../../shared/RegisterWalletSelector.module.scss";

export const RegisterLightWalletContainer: React.FunctionComponent<TStateProps> = ({
  rootPath,
  showWalletSelector,
  children,
}) => (
  <>
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        <FormattedMessage id="wallet-selector.sign-up" />
      </h1>
      <section className={styles.main}>
        <p className={styles.explanation}>
          <FormattedMessage id="wallet-selector.neuwallet.explanation" />
        </p>
        {children}
      </section>
      {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LIGHT} />}
    </div>
  </>
);
