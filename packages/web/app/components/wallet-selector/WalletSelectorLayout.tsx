import { Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { ELogoutReason } from "../../modules/auth/types";
import { WalletRouter } from "./WalletRouter";

import * as styles from "./WalletSelectorLayout.module.scss";

interface IExternalProps {
  rootPath: string;
  isLoginRoute: boolean;
  walletSelectionDisabled: boolean;
  openICBMModal: () => void;
  logoutReason: ELogoutReason | undefined;
  redirectLocation: Location;
}

export const WalletSelectorLayout: React.FunctionComponent<IExternalProps> = ({
  rootPath,
  redirectLocation,
  isLoginRoute,
  walletSelectionDisabled,
  logoutReason,
}) => (
  <>
    {logoutReason === ELogoutReason.SESSION_TIMEOUT && (
      <div
        data-test-id="wallet-selector-session-timeout-notification"
        className={styles.notification}
      >
        <FormattedHTMLMessage tagName="span" id="notifications.auth-session-timeout" />
      </div>
    )}
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        {isLoginRoute ? (
          <FormattedMessage id="wallet-selector.log-in" />
        ) : (
          <FormattedMessage id="wallet-selector.sign-up" />
        )}
      </h1>
      <WalletRouter
        rootPath={rootPath}
        redirectLocation={redirectLocation}
        walletSelectionDisabled={walletSelectionDisabled}
      />
    </div>
  </>
);
