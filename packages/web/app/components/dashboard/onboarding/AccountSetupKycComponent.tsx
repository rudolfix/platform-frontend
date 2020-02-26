import { Button, EButtonLayout } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { connectKycStatusWidget } from "../../settings/kyc-states/connectKycStatus";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { WarningAlert } from "../../shared/WarningAlert";

import * as styles from "./AccountSetupKycComponent.module.scss";

export interface IAccountSetupKycStartLayoutProps {
  isLoading: boolean;
  error: boolean;
  onGoToKycHome: () => void;
}

export const AccountSetupKycStartLayout: React.FunctionComponent<IAccountSetupKycStartLayoutProps> = ({
  isLoading,
  error,
  onGoToKycHome,
}) => {
  if (isLoading) {
    return <LoadingIndicator className={styles.loading} />;
  } else if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="settings.kyc-widget.error" />
      </WarningAlert>
    );
  } else {
    return (
      <section
        className={styles.accountSetupSection}
        data-test-id="account-setup-start-kyc-section"
      >
        <p className={styles.accountSetupText}>
          <FormattedMessage id="account-setup.kyc-widget-text" />
        </p>
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onGoToKycHome}
          data-test-id="start-kyc-button"
        >
          <FormattedMessage id="account-setup.kyc-widget-start-kyc" />
        </Button>
      </section>
    );
  }
};

export const AccountSetupKycPendingLayout: React.FunctionComponent<IAccountSetupKycStartLayoutProps> = ({
  onGoToKycHome,
}) => (
  <>
    <Button
      layout={EButtonLayout.PRIMARY}
      type="button"
      onClick={onGoToKycHome}
      data-test-id="kyc-additional-documents-button"
    >
      <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
    </Button>
  </>
);

export const AccountSetupKycComponent = compose<IAccountSetupKycStartLayoutProps, {}>(
  connectKycStatusWidget(),
)(AccountSetupKycStartLayout);

export const AccountSetupKycPendingComponent = compose<IAccountSetupKycStartLayoutProps, {}>(
  connectKycStatusWidget(),
)(AccountSetupKycPendingLayout);
