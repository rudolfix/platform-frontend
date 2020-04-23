import { ButtonInline } from "@neufund/design-system";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EWalletType } from "../../../../modules/web3/types";
import { WalletChooser } from "../../shared/WalletChooser";

import mailLink from "../../../../assets/img/login-link.svg";
import * as styles from "./MissingEmailLightWallet.module.scss";

type TExternalProps = {
  goToPasswordRecovery: () => void;
  shouldShowWalletSelector: boolean;
};

export const MissingEmailLightWallet: React.FunctionComponent<TExternalProps> = ({
  goToPasswordRecovery,
}) => (
  <>
    <h1 className={styles.title}>
      <FormattedMessage id="wallet-selector.log-in" />
    </h1>
    <section className="text-center" data-test-id="modals.wallet-selector.login-light-wallet">
      <img src={mailLink} className={styles.icon} />
      <p className={styles.missingEmail} data-test-id="neuwallet-missing-email">
        <FormattedHTMLMessage id="wallet-selector.neuwallet.login-instructions" tagName="span" />
      </p>
      <p className={styles.forgottenPassword}>
        <FormattedMessage
          id="wallet-selector.neuwallet.forgotten-password"
          values={{
            link: (
              <ButtonInline onClick={goToPasswordRecovery}>
                <FormattedMessage id="wallet-selector.neuwallet.recover-password" />
              </ButtonInline>
            ),
          }}
        />
      </p>
      <WalletChooser isLogin={true} activeWallet={EWalletType.LIGHT} />
    </section>
  </>
);