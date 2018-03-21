import * as React from "react";
import { KycRouter } from "./Router";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { TRequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectKycRequestStatuts } from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { ArrowLink } from "../shared/ArrowNavigation";
import { KycPanel } from "./KycPanel";

interface IStateProps {
  requestLoading?: boolean;
  requestStatus?: TRequestStatus;
}

interface IDispatchProps {
  reopenRequest: () => void;
  goToSettings: () => void;
}

type IProps = IStateProps & IDispatchProps;

const RequestStateInfo: React.SFC<IProps> = props => {
  const settingsButton = (
    <ArrowLink arrowDirection={"left"} to="#" onClick={props.goToSettings}>
      Go to settings
    </ArrowLink>
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
        description="We have received your request and are currently processing it."
      >
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
      requestStatus: selectKycRequestStatuts(state.kyc),
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
