import { Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { WalletRouter } from "./WalletRouter";

import * as styles from "./WalletSelectorLayout.module.scss";

interface IExternalProps {
  rootPath: string;
  openICBMModal: () => void;
  walletSelectionDisabled: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
}

interface IExternalRegisterProps {
  rootPath: string;
  openICBMModal: () => void;
  walletSelectionDisabled: boolean;
  redirectLocation: Location;
}

export const WalletSelectorLoginLayout: React.FunctionComponent<IExternalProps> = ({
  rootPath,
  redirectLocation,
  walletSelectionDisabled,
  showLogoutReason,
}) => (
  <>
    {showLogoutReason && (
      <div
        data-test-id="wallet-selector-session-timeout-notification"
        className={styles.notification}
      >
        <FormattedHTMLMessage tagName="span" id="notifications.auth-session-timeout" />
      </div>
    )}
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        <FormattedMessage id="wallet-selector.log-in" />
      </h1>
      <WalletRouter
        rootPath={rootPath}
        redirectLocation={redirectLocation}
        walletSelectionDisabled={walletSelectionDisabled}
      />
    </div>
  </>
);

export const WalletSelectorRegisterLayout: React.FunctionComponent<IExternalRegisterProps> = ({
  rootPath,
  redirectLocation,
  walletSelectionDisabled,
}) => (
  <>
    {console.log("WalletSelectorRegisterLayout", rootPath)}
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <h1 className={styles.title}>
        <FormattedMessage id="wallet-selector.sign-up" />
      </h1>
      <WalletRouter
        rootPath={rootPath}
        redirectLocation={redirectLocation}
        walletSelectionDisabled={walletSelectionDisabled}
      />
    </div>
  </>
);
