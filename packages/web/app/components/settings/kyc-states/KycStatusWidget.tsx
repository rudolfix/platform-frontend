import { Button, EButtonLayout, EIconPosition } from "@neufund/design-system";
import { EKycInstantIdStatus, EKycRequestStatus, EKycRequestType } from "@neufund/shared-modules";
import { InvariantError } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { THocProps } from "../../../types";
import { EColumnSpan } from "../../layouts/Container";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { connectKycStatusWidget } from "./connectKycStatus";

import arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import infoIcon from "../../../assets/img/notifications/info.svg";
import successIcon from "../../../assets/img/notifications/success.svg";
import warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IExternalProps {
  step: number;
  columnSpan?: EColumnSpan;
}

export type IKycStatusWidgetProps = THocProps<typeof connectKycStatusWidget> & IExternalProps;

const statusTextMap = (
  kycRequestType: EKycRequestType | undefined,
): Record<EKycRequestStatus, React.ReactNode> => ({
  [EKycRequestStatus.ACCEPTED]: (
    <FormattedMessage id="settings.kyc-status-widget.status.accepted" />
  ),
  [EKycRequestStatus.REJECTED]: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.rejected"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  [EKycRequestStatus.IGNORED]: (
    <FormattedMessage
      id="settings.kyc-status-widget.status.ignored"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  [EKycRequestStatus.PENDING]:
    kycRequestType === "business" ? (
      <FormattedHTMLMessage
        tagName="span"
        id="settings.kyc-status-widget.status.pending.business"
        values={{ url: externalRoutes.neufundSupportHome }}
      />
    ) : (
      <FormattedHTMLMessage
        tagName="span"
        id="settings.kyc-status-widget.status.pending.individual"
        values={{ url: externalRoutes.neufundSupportHome }}
      />
    ),
  [EKycRequestStatus.DRAFT]: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.draft"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  [EKycRequestStatus.OUTSOURCED]: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.started" />
  ),
});

const getStatus = ({
  isUserEmailVerified,
  isKycFlowBlockedByRegion,
  requestStatus,
  instantIdStatus,
  kycRequestType,
}: IKycStatusWidgetProps): React.ReactNode => {
  if (!requestStatus) {
    throw new InvariantError("Request status should be defined at this point");
  }

  // In case KYC flow is blocked show message immediately
  if (isKycFlowBlockedByRegion) {
    return (
      <span data-test-id="settings.kyc-status-widget.kyc-prohibited-region">
        <FormattedMessage id="settings.kyc-status-widget.status.error-prohibited-region" />
      </span>
    );
  }

  if (!isUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (
    requestStatus === EKycRequestStatus.OUTSOURCED &&
    instantIdStatus === EKycInstantIdStatus.PENDING
  ) {
    if (kycRequestType === EKycRequestType.BUSINESS) {
      return (
        <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending.business" />
      );
    }

    return (
      <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending.individual" />
    );
  }

  return statusTextMap(kycRequestType)[requestStatus];
};

const ActionButton = ({
  requestStatus,
  onGoToKycHome,
  isUserEmailVerified,
  onGoToDashboard,
  backupCodesVerified,
  isKycFlowBlockedByRegion,
  instantIdStatus,
}: IKycStatusWidgetProps) => {
  if (requestStatus === EKycRequestStatus.ACCEPTED) {
    return (
      <Button
        layout={EButtonLayout.LINK}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToDashboard}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="kyc.request-state.go-to-dashboard" />
      </Button>
    );
  }

  if (requestStatus === EKycRequestStatus.DRAFT && !isKycFlowBlockedByRegion) {
    return (
      <Button
        id="start-kyc-process"
        layout={EButtonLayout.LINK}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified || !backupCodesVerified}
        data-test-id="settings.kyc-status-widget.start-kyc-process"
      >
        <FormattedMessage id="settings.kyc-status-widget.start-kyc-process" />
      </Button>
    );
  }

  if (requestStatus === EKycRequestStatus.PENDING) {
    return (
      <Button
        layout={EButtonLayout.LINK}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
      </Button>
    );
  }

  if (
    requestStatus === EKycRequestStatus.OUTSOURCED &&
    instantIdStatus === EKycInstantIdStatus.DRAFT
  ) {
    return (
      <Button
        id="continue-kyc-continue-verification"
        layout={EButtonLayout.PRIMARY}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified || !backupCodesVerified}
        data-test-id="settings.kyc-status-widget.continue-kyc-verification"
      >
        <FormattedMessage id="settings.kyc-status-widget.continue-kyc" />
      </Button>
    );
  }

  return null;
};

const StatusIcon = ({ requestStatus, isLoading }: IKycStatusWidgetProps) => {
  if (isLoading) {
    return null;
  }

  if (requestStatus === EKycRequestStatus.ACCEPTED) {
    return <img src={successIcon} className={styles.icon} alt="" />;
  }

  if (requestStatus === EKycRequestStatus.PENDING) {
    return <img src={infoIcon} className={styles.icon} alt="" />;
  }

  return <img src={warningIcon} className={styles.icon} alt="" />;
};

export const KycStatusWidgetBase: React.FunctionComponent<IKycStatusWidgetProps> = props => {
  const { isLoading, error, step, columnSpan } = props;

  return (
    <Panel
      columnSpan={columnSpan}
      headerText={<FormattedMessage id="settings.kyc-widget.header" values={{ step }} />}
      rightComponent={<StatusIcon {...props} />}
    >
      {isLoading ? (
        <div className={styles.panelBody}>
          <Row noGutters>
            <Col>
              <LoadingIndicator className={styles.loading} />
            </Col>
          </Row>
        </div>
      ) : error ? (
        <WarningAlert>
          <FormattedMessage id="settings.kyc-widget.error" />
        </WarningAlert>
      ) : (
        <section className={cn(styles.section)}>
          <p className={cn(styles.text, "pt-2")}>{getStatus(props)}</p>
          <ActionButton {...props} />
        </section>
      )}
    </Panel>
  );
};

export const KycStatusWidget = compose<IKycStatusWidgetProps, IExternalProps>(
  connectKycStatusWidget(),
)(KycStatusWidgetBase);
