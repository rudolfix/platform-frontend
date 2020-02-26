import { Location } from "history";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { ELogoutReason } from "../../modules/auth/types";
import { Heading } from "../shared/Heading";
import { EWarningAlertLayout, EWarningAlertSize, WarningAlert } from "../shared/WarningAlert";
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

export const WalletSelectorLayoutContainer: React.FunctionComponent<Pick<
  IExternalProps,
  "isLoginRoute" | "logoutReason"
>> = ({ isLoginRoute, logoutReason, children }) => (
  <>
    {logoutReason === ELogoutReason.SESSION_TIMEOUT && (
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
        {isLoginRoute ? (
          <FormattedMessage id="wallet-selector.log-in" />
        ) : (
          <FormattedMessage id="wallet-selector.sign-up" />
        )}
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
