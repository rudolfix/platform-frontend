import { Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { Heading } from "../shared/Heading";
import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "../shared/WarningAlert";
import { WalletRouter } from "./WalletRouter";

import * as styles from "./shared/RegisterWalletSelector.module.scss";

interface IExternalProps {
  rootPath: string;
  openICBMModal: () => void;
  showWalletSelector: boolean;
  showLogoutReason: boolean;
  redirectLocation: Location;
}

export const WalletSelectorLayoutContainer: React.FunctionComponent<{
  showLogoutReason: boolean;
}> = ({ showLogoutReason, children }) => (
  <>
    {showLogoutReason && (
      <WarningAlert
        className={styles.logoutNotification}
        size={EWarningAlertSize.BIG}
        layout={EWarningAlertLayout.INLINE}
        data-test-id="wallet-selector-session-timeout-notification"
      >
        <FormattedHTMLMessage tagName="span" id="notifications.auth-session-timeout" />
      </WarningAlert>
    )}
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <Heading level={2} decorator={false} className={styles.title} disableTransform={true}>
        <FormattedMessage id="wallet-selector.log-in" />
      </Heading>
      {children}
    </div>
  </>
);

export const WalletSelectorLoginLayout: React.FunctionComponent<IExternalProps> = ({
  rootPath,
  redirectLocation,
  showWalletSelector,
  showLogoutReason,
}) => (
  <WalletSelectorLayoutContainer showLogoutReason={showLogoutReason}>
    <div className={styles.wrapper} data-test-id="wallet-selector">
      <WalletRouter
        rootPath={rootPath}
        redirectLocation={redirectLocation}
        showWalletSelector={showWalletSelector}
      />
    </div>
  </WalletSelectorLayoutContainer>
);
