import * as React from "react";
import { KycRouter } from "./Router";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import {
  selectKycOutSourcedURL,
  selectKycRequestStatus,
  selectPendingKycRequestType,
} from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Button } from "../shared/Buttons";
import { KycPanel } from "./KycPanel";
import { KYCAddDocuments } from "./shared/AddDocuments";

import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";

interface IStateProps {
  requestLoading?: boolean;
  requestStatus?: TRequestStatus;
  redirectUrl: string;
  pendingRequestType: "individual" | "business" | undefined;
}

interface IDispatchProps {
  reopenRequest: () => void;
  goToSettings: () => void;
}

type IProps = IStateProps & IDispatchProps;

const RequestStateInfo: React.SFC<IProps> = props => {
  const settingsButton = (
    <div className="p-4 text-center">
      <Button
        layout="secondary"
        iconPosition="icon-before"
        svgIcon={arrowLeft}
        onClick={props.goToSettings}
      >
        Go to settings
      </Button>
    </div>
  );
  if (!props.requestStatus) {
    return (
      <KycPanel title="Kyc request" steps={5} currentStep={0} description="Loading...">
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Pending") {
    return (
      <KycPanel
        title="Kyc request received"
        steps={5}
        currentStep={5}
        description="We have received your request and are currently processing it. You can submit additional documents for your request here."
      >
        {props.pendingRequestType && <KYCAddDocuments uploadType={props.pendingRequestType} />}
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Approved") {
    return (
      <KycPanel
        title="Kyc request approved"
        steps={5}
        currentStep={5}
        description="Your Kyc request was approved"
      >
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Rejected") {
    return (
      <KycPanel
        title="Kyc request rejected"
        steps={5}
        currentStep={5}
        description="Your Kyc request was rejected"
      >
        {settingsButton}
      </KycPanel>
    );
  }
  if (props.requestStatus === "Outsourced") {
    return (
      <KycPanel
        title="Instant identification started"
        steps={5}
        currentStep={5}
        description="If you're not automatically forwarded to idNow, please click the link below to continue."
      >
        {" "}
        <div className="p-4 text-center">
          <a href={props.redirectUrl}>Click here to continue</a>
        </div>
      </KycPanel>
    );
  }
  return <div />;
};

export const KycComponent: React.SFC<IProps> = props => {
  const router = props.requestStatus === "Draft" ? <KycRouter /> : <div />;

  return (
    <LayoutAuthorized>
      <Row>
        <Col xs={12} lg={{ size: 8, offset: 2 }}>
          <RequestStateInfo {...props} />
          {router}
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};

export const Kyc = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestLoading:
        state.kyc.individualRequestStateLoading || state.kyc.businessRequestStateLoading,
      requestStatus: selectKycRequestStatus(state.kyc),
      redirectUrl: selectKycOutSourcedURL(state.kyc),
      pendingRequestType: selectPendingKycRequestType(state.kyc),
    }),
    dispatchToProps: dispatch => ({
      reopenRequest: () => {},
      goToSettings: () => dispatch(actions.routing.goToSettings()),
    }),
    options: { pure: false },
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
      dispatch(actions.kyc.kycLoadBusinessRequest());
    },
  }),
)(KycComponent);
