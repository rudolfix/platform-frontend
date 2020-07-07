import { EKycRequestStatus, EKycRequestType, kycApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { onLeaveAction } from "../../../utils/react-connected-components/OnLeaveAction";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { AccountSetupKycPendingComponent } from "./AccountSetupKycComponent";

import * as styles from "./Onboarding.module.scss";

interface IKycPendingProps {
  kycRequestStatus: EKycRequestStatus;
  kycRequestType: EKycRequestType;
}

const OnboardingKycPendingBase: React.FunctionComponent<IKycPendingProps> = ({
  kycRequestStatus,
  kycRequestType,
}) => (
  <div className={styles.accountSetupKycPendingWrapper} data-test-id="onboarding-kyc-pending">
    <h1 className={styles.titleLarge}>
      <FormattedMessage id="account-setup.pending-kyc.title" />
      <span className={styles.status}>
        {getMessageTranslation(kycApi.utils.kycStatusToTranslationMessage(kycRequestStatus))}
      </span>
    </h1>
    <p>
      {kycRequestType === EKycRequestType.BUSINESS ? (
        <FormattedHTMLMessage
          tagName="span"
          id="account-setup.pending-kyc.text.business"
          values={{ href: externalRoutes.neufundSupportHome }}
        />
      ) : (
        <FormattedHTMLMessage
          tagName="span"
          id="account-setup.pending-kyc.text.individual"
          values={{ href: externalRoutes.neufundSupportHome }}
        />
      )}
    </p>
    <AccountSetupKycPendingComponent />
  </div>
);

const OnboardingKycRejectedBase: React.FunctionComponent<Omit<
  IKycPendingProps,
  "kycRequestType"
>> = ({ kycRequestStatus }) => (
  <div className={styles.accountSetupKycPendingWrapper} data-test-id="onboarding-kyc-pending">
    <h1 className={styles.titleLarge}>
      <FormattedMessage id="account-setup.pending-kyc.title" />
      <span className={styles.status}>
        {getMessageTranslation(kycApi.utils.kycStatusToTranslationMessage(kycRequestStatus))}
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
