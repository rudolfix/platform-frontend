import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TRequestOutsourcedStatus, TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import {
  selectExternalKycUrl,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectWidgetError,
  selectWidgetLoading,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { UnionDictionary } from "../../../types";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { WarningAlert } from "../../shared/WarningAlert";
import * as styles from "./KycStatusWidget.module.scss";

interface IStateProps {
  requestStatus?: TRequestStatus;
  requestOutsourcedStatus?: TRequestOutsourcedStatus;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  error?: string;
  externalKycUrl?: string;
}

interface IOwnProps {
  step: number;
}

interface IDispatchProps {
  onGoToKycHome: () => void;
}

export type IKycStatusWidgetProps = IStateProps & IDispatchProps & IOwnProps;

const statusTextMap: UnionDictionary<TRequestStatus, React.ReactNode> = {
  Accepted: <FormattedMessage id="settings.kyc-status-widget.status.accepted" />,
  Rejected: <FormattedMessage id="settings.kyc-status-widget.status.rejected" />,
  Pending: <FormattedMessage id="settings.kyc-status-widget.status.pending" />,
  Draft: <FormattedMessage id="settings.kyc-status-widget.status.draft" />,
  Outsourced: <FormattedMessage id="settings.kyc-status-widget.status.outsourced" />,
};

const outsourcedStatusTextMap: UnionDictionary<TRequestOutsourcedStatus, React.ReactNode> = {
  review_pending: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
  aborted: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
    />
  ),
  canceled: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
    />
  ),
  other: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.other" />,
  started: "",
  success: "",
  success_data_changed: "",
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
}: IKycStatusWidgetProps) => {
  if (requestStatus === "Draft" || requestStatus === "Pending") {
    return (
      <Button
        layout="secondary"
        iconPosition="icon-after"
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified}
      >
        {requestStatus === "Draft" ? (
          <FormattedMessage id="settings.kyc-status-widget.start-kyc-process" />
        ) : (
          <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
        )}
      </Button>
    );
  }

  if (
    requestStatus === "Outsourced" &&
    (requestOutsourcedStatus === "canceled" || requestOutsourcedStatus === "aborted")
  ) {
    return (
      <a href={externalKycUrl}>
        <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
          <FormattedMessage id="settings.kyc-status-widget.continue-external-kyc" />
        </Button>
      </a>
    );
  }

  return <div />;
};

export const KycStatusWidgetComponent: React.SFC<IKycStatusWidgetProps> = props => {
  const {
    requestStatus,
    requestOutsourcedStatus,
    isUserEmailVerified,
    isLoading,
    error,
    step,
  } = props;

  return (
    <PanelDark
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
        <div className={styles.content}>
          <Row noGutters>
            <Col>
              <LoadingIndicator className={styles.loading} />
            </Col>
          </Row>
        </div>
      ) : error ? (
        <div className={styles.content}>
          <WarningAlert>
            <FormattedMessage id="settings.kyc-widget.error" />
          </WarningAlert>
        </div>
      ) : (
        <>
          {requestStatus === "Accepted" ? (
            <div data-test-id="verified-section" className={styles.content}>
              <div className="pt-2">{statusTextMap[requestStatus]}</div>
            </div>
          ) : (
            <div
              data-test-id="unverified-section"
              className={cn(styles.content, "d-flex flex-wrap align-content-around")}
            >
              <p className={cn(styles.text, "pt-2")}>
                {getStatus(isUserEmailVerified, requestStatus, requestOutsourcedStatus)}
              </p>
              <Col xs={12} className="d-flex justify-content-center">
                <ActionButton {...props} />
              </Col>
            </div>
          )}
        </>
      )}
    </PanelDark>
  );
};

export const KycStatusWidget = compose<React.ComponentClass<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      requestStatus: selectKycRequestStatus(s.kyc),
      requestOutsourcedStatus: selectKycRequestOutsourcedStatus(s.kyc),
      externalKycUrl: selectExternalKycUrl(s.kyc),
      isLoading: selectWidgetLoading(s.kyc),
      error: selectWidgetError(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
    }),
  }),
  // note: data for this view are loaded as part of app init process
)(KycStatusWidgetComponent);
