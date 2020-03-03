import { ButtonInline } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import mailLink from "../../../../assets/img/login-link.svg";
import * as styles from "./WalletLight.module.scss";

type TExternalProps = {
  goToPasswordRecovery: () => void;
};

export const MissingEmailLightWallet: React.FunctionComponent<TExternalProps> = ({
  goToPasswordRecovery,
}) => (
  <section className="text-center" data-test-id="modals.wallet-selector.login-light-wallet">
    <img src={mailLink} className={styles.icon} />
    <p className={styles.missingEmail} data-test-id="neuwallet-missing-email">
      <FormattedMessage id="wallet-selector.neuwallet.login-instructions" />
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
  </section>
);
