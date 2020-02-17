import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { kycStatusToTranslationMessage } from "../../../modules/kyc/utils";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { onLeaveAction } from "../../../utils/react-connected-components/OnLeaveAction";
import { AccountSetupKycPendingComponent } from "../../settings/kyc-states/AccountSetupKycComponent";
import { getMessageTranslation } from "../../translatedMessages/messages";

import * as styles from "./Onboarding.module.scss";

interface IKycPendingProps {
  kycRequestStatus: EKycRequestStatus;
}

const OnboardingKycPendingBase: React.FunctionComponent<IKycPendingProps> = ({
  kycRequestStatus,
}) => (
  <div className={styles.accountSetupKycPendingWrapper} data-test-id="onboarding-kyc-pending">
    <h1 className={styles.titleLarge}>
      <FormattedMessage id="account-setup.pending-kyc.title" />{" "}
      <span className={styles.status}>
        {getMessageTranslation(kycStatusToTranslationMessage(kycRequestStatus))}
      </span>
    </h1>
    <p>
      <FormattedHTMLMessage
        tagName="span"
        id="account-setup.pending-kyc.text"
        values={{ href: externalRoutes.neufundSupportHome }}
      />
    </p>
    <AccountSetupKycPendingComponent />
  </div>
);

const OnboardingKycRejectedBase: React.FunctionComponent<IKycPendingProps> = ({
  kycRequestStatus,
}) => (
  <div className={styles.accountSetupKycPendingWrapper} data-test-id="onboarding-kyc-pending">
    <h1 className={styles.titleLarge}>
      <FormattedMessage id="account-setup.pending-kyc.title" />{" "}
      <span className={styles.status}>
        {getMessageTranslation(kycStatusToTranslationMessage(kycRequestStatus))}
      </span>
    </h1>
    <p>
      <FormattedHTMLMessage
        tagName="span"
        id="settings.kyc-status-widget.status.rejected"
        values={{ url: externalRoutes.neufundSupportHome }}
      />
    </p>
  </div>
);

const OnboardingKycPending = compose<IKycPendingProps, IKycPendingProps>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycStartWatching()),
  }),
  onLeaveAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycStopWatching()),
  }),
  branch<IKycPendingProps>(
    ({ kycRequestStatus }) =>
      kycRequestStatus === EKycRequestStatus.REJECTED ||
      kycRequestStatus === EKycRequestStatus.IGNORED,
    renderComponent(OnboardingKycRejectedBase),
  ),
)(OnboardingKycPendingBase);

export { OnboardingKycPendingBase, OnboardingKycPending };
