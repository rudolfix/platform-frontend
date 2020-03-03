import { Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { Heading } from "../shared/Heading";
import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "../shared/WarningAlert";
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

export const WalletSelectorLayoutContainer: React.FunctionComponent<{showLogoutReason:boolean}> = ({  showLogoutReason, children }) => (
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

export const WalletSelectorLayout: React.FunctionComponent<IExternalProps> = props => (
  <WalletSelectorLayoutContainer {...props}>
    <WalletRouter
      rootPath={props.rootPath}
      redirectLocation={props.redirectLocation}
      walletSelectionDisabled={props.walletSelectionDisabled}
    />
  </WalletSelectorLayoutContainer>
);

export const WalletSelectorLoginLayout: React.FunctionComponent<IExternalProps> = ({
  rootPath,
  redirectLocation,
  walletSelectionDisabled,
  showLogoutReason,
}) => (

    <WalletSelectorLayoutContainer showLogoutReason={showLogoutReason}>
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
    </WalletSelectorLayoutContainer>

);


export const WalletSelectorRegisterLayout: React.FunctionComponent<IExternalRegisterProps> = ({
  rootPath,
  redirectLocation,
  walletSelectionDisabled,
}) => (
  <>
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

