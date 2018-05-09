import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import {
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
  isUserEmailVerified: boolean;
  isLoading: boolean;
  error?: string;
}

interface IOwnProps {
  step: number;
}

interface IDispatchProps {
  onGoToKycHome: () => void;
}

type IProps = IStateProps & IDispatchProps & IOwnProps & IIntlProps;

const statusTextMap: UnionDictionary<TRequestStatus, React.ReactNode> = {
  Accepted: <FormattedMessage id="settings.kyc-status-widget.status.accepted" />,
  Rejected: <FormattedMessage id="settings.kyc-status-widget.status.rejected" />,
  Pending: <FormattedMessage id="settings.kyc-status-widget.status.pending" />,
  Draft: <FormattedMessage id="settings.kyc-status-widget.status.draft" />,
  Outsourced: <FormattedMessage id="settings.kyc-status-widget.status.outsourced" />,
};

const getStatus = (
  selectIsUserEmailVerified: boolean,
  requestStatus?: TRequestStatus,
): React.ReactNode => {
  if (!selectIsUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (!requestStatus) {
    return "";
  }

  return statusTextMap[requestStatus];
};

export const KycStatusWidgetComponent: React.SFC<IProps> = ({
  intl: { formatIntlMessage },
  requestStatus,
  isUserEmailVerified,
  onGoToKycHome,
  isLoading,
  error,
  step,
}) => {
  return (
    <PanelDark
      headerText={formatIntlMessage("settings.kyc-widget.header", { step })}
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
                {getStatus(isUserEmailVerified, requestStatus)}
              </p>
              <Col xs={12} className="d-flex justify-content-center">
                {requestStatus && (requestStatus === "Draft" || requestStatus === "Pending") ? (
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
                ) : (
                  <div />
                )}
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
      isLoading: selectWidgetLoading(s.kyc),
      error: selectWidgetError(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
    }),
  }),
  // note: data for this view are loaded as part of app init process
  injectIntlHelpers,
)(KycStatusWidgetComponent);
