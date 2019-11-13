import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import {
  EKycRequestStatus,
  ERequestOutsourcedStatus,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { THocProps } from "../../../types";
import { EColumnSpan } from "../../layouts/Container";
import { Button, ButtonLink, EButtonLayout, EIconPosition } from "../../shared/buttons/index";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { connectKycStatusWidget } from "./connectKycStatus";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as successIcon from "../../../assets/img/notifications/success.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IExternalProps {
  step: number;
  columnSpan?: EColumnSpan;
}

export type IKycStatusWidgetProps = THocProps<typeof connectKycStatusWidget> & IExternalProps;

const statusTextMap: Record<EKycRequestStatus, React.ReactNode> = {
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
  [EKycRequestStatus.IGNORED]: <FormattedMessage id="settings.kyc-status-widget.status.ignored" />,
  [EKycRequestStatus.PENDING]: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.pending"
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
};

const outsourcedStatusTextMap: Record<ERequestOutsourcedStatus, React.ReactNode> = {
  review_pending: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
  aborted: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  canceled: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
    />
  ),
  other: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.outsourced.other-info"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  started: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.started" />,
  success: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />,
  success_data_changed: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
};

const getStatus = (
  selectIsUserEmailVerified: boolean,
  isKycFlowBlockedByRegion: boolean,
  requestStatus: EKycRequestStatus | undefined,
  requestOutsourcedStatus?: ERequestOutsourcedStatus | undefined,
): React.ReactNode => {
  if (!selectIsUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (isKycFlowBlockedByRegion) {
    return (
      <span data-test-id="settings.kyc-status-widget.kyc-prohibited-region">
        <FormattedMessage id="settings.kyc-status-widget.status.error-prohibited-region" />
      </span>
    );
  }

  if (!requestStatus) {
    return "";
  }

  if (requestStatus === EKycRequestStatus.OUTSOURCED && requestOutsourcedStatus) {
    return outsourcedStatusTextMap[requestOutsourcedStatus];
  }

  return statusTextMap[requestStatus];
};

const ActionButton = ({
  requestStatus,
  requestOutsourcedStatus,
  onGoToKycHome,
  isUserEmailVerified,
  externalKycUrl,
  userType,
  onGoToDashboard,
  backupCodesVerified,
  cancelInstantId,
  isKycFlowBlockedByRegion,
}: IKycStatusWidgetProps) => {
  if (requestStatus === EKycRequestStatus.ACCEPTED && userType === EUserType.INVESTOR) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
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
        layout={EButtonLayout.SECONDARY}
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
        layout={EButtonLayout.SECONDARY}
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
    externalKycUrl &&
    requestStatus === EKycRequestStatus.OUTSOURCED &&
    (requestOutsourcedStatus === ERequestOutsourcedStatus.CANCELED ||
      requestOutsourcedStatus === ERequestOutsourcedStatus.ABORTED ||
      requestOutsourcedStatus === ERequestOutsourcedStatus.STARTED)
  ) {
    return (
      <>
        <ButtonLink
          to={externalKycUrl}
          layout={EButtonLayout.SECONDARY}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
        >
          <FormattedMessage id="settings.kyc-status-widget.continue-external-kyc" />
        </ButtonLink>
        <Button
          layout={EButtonLayout.SECONDARY}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
          onClick={cancelInstantId}
          data-test-id="settings.kyc-status-widget.cancel-external-kyc-button"
        >
          <FormattedMessage id="settings.kyc-status-widget.cancel-external-kyc" />
        </Button>
      </>
    );
  }

  return null;
};

const StatusIcon = ({
  requestStatus,
  isLoading,
  requestOutsourcedStatus,
}: IKycStatusWidgetProps) => {
  if (isLoading) {
    return null;
  }

  if (
    requestStatus === EKycRequestStatus.ACCEPTED ||
    (requestStatus === EKycRequestStatus.OUTSOURCED &&
      [ERequestOutsourcedStatus.SUCCESS, ERequestOutsourcedStatus.SUCCESS_DATA_CHANGED].includes(
        requestOutsourcedStatus!,
      ))
  ) {
    return <img src={successIcon} className={styles.icon} alt="" />;
  }

  if (
    requestStatus === EKycRequestStatus.PENDING ||
    (requestStatus === EKycRequestStatus.OUTSOURCED &&
      [
        ERequestOutsourcedStatus.STARTED,
        ERequestOutsourcedStatus.REVIEW_PENDING,
        ERequestOutsourcedStatus.OTHER,
      ].includes(requestOutsourcedStatus!))
  ) {
    return <img src={infoIcon} className={styles.icon} alt="" />;
  }

  return <img src={warningIcon} className={styles.icon} alt="" />;
};

export const KycStatusWidgetBase: React.FunctionComponent<IKycStatusWidgetProps> = props => {
  const {
    requestStatus,
    requestOutsourcedStatus,
    isUserEmailVerified,
    isLoading,
    error,
    step,
    columnSpan,
    isKycFlowBlockedByRegion,
  } = props;

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
          <p className={cn(styles.text, "pt-2")}>
            {getStatus(
              isUserEmailVerified,
              isKycFlowBlockedByRegion,
              requestStatus,
              requestOutsourcedStatus,
            )}
          </p>
          <ActionButton {...props} />
        </section>
      )}
    </Panel>
  );
};

export const KycStatusWidget = compose<IKycStatusWidgetProps, IExternalProps>(
  connectKycStatusWidget(),
)(KycStatusWidgetBase);
