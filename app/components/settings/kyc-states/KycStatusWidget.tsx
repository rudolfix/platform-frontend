import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { externalRoutes } from "../../../config/externalRoutes";
import { TRequestOutsourcedStatus, TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectUserType,
} from "../../../modules/auth/selectors";
import {
  selectExternalKycUrl,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectWidgetError,
  selectWidgetLoading,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { Button, ButtonLink, EButtonLayout } from "../../shared/buttons";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IStateProps {
  requestStatus?: TRequestStatus;
  requestOutsourcedStatus?: TRequestOutsourcedStatus;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  backupCodesVerified: boolean;
  error?: string;
  externalKycUrl?: string;
  userType: EUserType;
}

interface IOwnProps {
  step: number;
}

interface IDispatchProps {
  onGoToKycHome: () => void;
  onGoToDashboard: () => void;
  cancelInstantId: () => void;
}

export type IKycStatusWidgetProps = IStateProps & IDispatchProps & IOwnProps;

const statusTextMap: Record<TRequestStatus, React.ReactNode> = {
  Accepted: <FormattedMessage id="settings.kyc-status-widget.status.accepted" />,
  Rejected: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.rejected"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Ignored: <FormattedMessage id="settings.kyc-status-widget.status.ignored" />,
  Pending: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.pending"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Draft: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.draft"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  Outsourced: <FormattedMessage id="settings.kyc-status-widget.status.outsourced" />,
};

const outsourcedStatusTextMap: Record<TRequestOutsourcedStatus, React.ReactNode> = {
  review_pending: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
  aborted: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
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
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  started: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.outsourced"
      values={{ url: `${externalRoutes.neufundSupport}/home` }}
    />
  ),
  success: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />,
  success_data_changed: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
};

const getStatus = (
  selectIsUserEmailVerified: boolean,
  requestStatus?: TRequestStatus,
  requestOutsourcedStatus?: TRequestOutsourcedStatus,
): React.ReactNode => {
  if (!selectIsUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (!requestStatus) {
    return "";
  }

  if (requestStatus === "Outsourced" && requestOutsourcedStatus) {
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
}: IKycStatusWidgetProps) => {
  if (requestStatus === "Accepted" && userType === EUserType.INVESTOR) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToDashboard}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="kyc.request-state.go-to-dashboard" />
      </Button>
    );
  }

  if (requestStatus === "Draft") {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified || !backupCodesVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.start-kyc-process" />
      </Button>
    );
  }

  if (requestStatus === "Pending") {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition="icon-after"
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
    requestStatus === "Outsourced" &&
    (requestOutsourcedStatus === "canceled" ||
      requestOutsourcedStatus === "aborted" ||
      requestOutsourcedStatus === "started")
  ) {
    return (
      <>
        <ButtonLink
          to={externalKycUrl}
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-after"
          svgIcon={arrowRight}
        >
          <FormattedMessage id="settings.kyc-status-widget.continue-external-kyc" />
        </ButtonLink>
        <Button
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-after"
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

export const KycStatusWidgetComponent: React.FunctionComponent<IKycStatusWidgetProps> = props => {
  const {
    requestStatus,
    requestOutsourcedStatus,
    isUserEmailVerified,
    isLoading,
    error,
    step,
  } = props;

  return (
    <Panel
      className="h-100"
      headerText={<FormattedMessage id="settings.kyc-widget.header" values={{ step }} />}
      rightComponent={
        !isLoading &&
        (requestStatus === "Accepted" ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        ))
      }
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
        <section className={styles.panelBody}>
          <WarningAlert>
            <FormattedMessage id="settings.kyc-widget.error" />
          </WarningAlert>
        </section>
      ) : (
        <section className={cn(styles.section)}>
          <p className={cn(styles.text, "pt-2")}>
            {getStatus(isUserEmailVerified, requestStatus, requestOutsourcedStatus)}
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <ActionButton {...props} />
          </Col>
        </section>
      )}
    </Panel>
  );
};

export const KycStatusWidget = compose<React.ComponentClass<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      isUserEmailVerified: selectIsUserEmailVerified(state.auth),
      userType: selectUserType(state)!,
      backupCodesVerified: selectBackupCodesVerified(state),
      requestStatus: selectKycRequestStatus(state),
      requestOutsourcedStatus: selectKycRequestOutsourcedStatus(state.kyc),
      externalKycUrl: selectExternalKycUrl(state.kyc),
      isLoading: selectWidgetLoading(state.kyc),
      error: selectWidgetError(state.kyc),
    }),
    dispatchToProps: dispatch => ({
      onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
      onGoToDashboard: () => dispatch(actions.routing.goToDashboard()),
      cancelInstantId: () => dispatch(actions.kyc.kycCancelInstantId()),
    }),
  }),
  // note: initial data for this view are loaded as part of app init process
  onEnterAction({
    actionCreator: d => d(actions.kyc.kycStartWatching()),
  }),
  onLeaveAction({
    actionCreator: d => d(actions.kyc.kycStopWatching()),
  }),
)(KycStatusWidgetComponent);
