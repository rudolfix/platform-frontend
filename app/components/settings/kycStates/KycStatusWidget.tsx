import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";
import { compose } from "redux";

import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import { selectKycRequestStatus } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { Dictionary } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IStateProps {
  requestStatus?: TRequestStatus;
  isUserEmailVerified: boolean;
}

interface IDispatchProps {
  onGoToKycHome: () => void;
}

type IProps = IStateProps & IDispatchProps;

const statusTextMap: Dictionary<string> = {
  Approved: "Your Kyc request is has been approved. Happy investing!",
  Rejected: "Your Kyc request was rejected. ",
  Pending:
    "We are currently reviewing your Kyc request. You will receive and email once your request has been processed.",
  Draft: "Please submit your Kyc request now.",
  Outsourced:
    "Your instant identification is being processed. You will be notified by e-mail once this is completed.",
};

const getStatus = (selectIsUserEmailVerified: boolean, requestStatus?: TRequestStatus): string => {
  if (!selectIsUserEmailVerified) {
    return "You need to verify email before starting KYC";
  }

  if (!requestStatus) {
    return "";
  }

  return statusTextMap[requestStatus];
};

export const KycStatusWidgetComponent: React.SFC<IProps> = ({
  requestStatus,
  isUserEmailVerified,
  onGoToKycHome,
}) => {
  return (
    <PanelDark
      headerText="KYC PROCESS"
      rightComponent={
        requestStatus === "Accepted" ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {requestStatus === "Accepted" ? (
        <div data-test-id="verified-section" className={cn(styles.content)}>
          <div className="pt-2">{statusTextMap[requestStatus]}</div>
        </div>
      ) : (
        <div
          data-test-id="unverified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>{getStatus(isUserEmailVerified, requestStatus)}</p>
          <Col xs={12} className="d-flex justify-content-center">
            {requestStatus && (requestStatus === "Draft" || requestStatus === "Pending") ? (
              <Button
                layout="secondary"
                iconPosition="icon-after"
                svgIcon={arrowRight}
                onClick={onGoToKycHome}
                disabled={!isUserEmailVerified}
              >
                {requestStatus === "Draft" ? "Start KYC process" : "Submit additional Documents"}
              </Button>
            ) : (
              <div />
            )}
          </Col>
        </div>
      )}
    </PanelDark>
  );
};

export const KycStatusWidget = compose<React.ComponentClass>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      requestStatus: selectKycRequestStatus(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
      dispatch(actions.kyc.kycLoadBusinessRequest());
    },
  }),
)(KycStatusWidgetComponent);
