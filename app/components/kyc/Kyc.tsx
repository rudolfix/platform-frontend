import * as React from "react";
import { KycRouter } from "./Router";

import * as cn from "classnames";
import { Col, Container, Row } from "reactstrap";

import { compose } from "redux";
import { IKycRequestState } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { ProgressStepper } from "../shared/ProgressStepper";
import * as styles from "./Kyc.module.scss";

interface IStateProps {
  requestLoading?: boolean;
  individualRequestState?: IKycRequestState;
  businessRequestState?: IKycRequestState;
}

interface IDispatchProps {
  reopenRequest: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KycComponent: React.SFC<IProps> = props => {
  let requestState = props.individualRequestState;
  if (requestState && requestState.status === "draft") requestState = props.businessRequestState;

  let content = (
    <div>
      <br />
      <ProgressStepper steps={4} currentStep={4} />
      <br />
      <h1>Your KYC request</h1>
      <br />
    </div>
  );
  let stateContent = <div />;

  if (!requestState) {
    stateContent = <div>Loading ...</div>;
  } else if (requestState.status === "pending") {
    stateContent = (
      <div>
        We have received your request and are currently processing it.{" "}
        <a href="#" onClick={props.reopenRequest}>
          Click here to re-open your request to add additional data.
        </a>
      </div>
    );
  } else if (requestState.status === "approved") {
    stateContent = <div>Your request has been approved!</div>;
  } else if (requestState.status === "rejected") {
    stateContent = <div>Your request has been rejected!</div>;
  } else if (requestState.status === "draft") {
    content = <KycRouter />;
  }

  return (
    <Container>
      <Row>
        <Col lg="12" xl={{ size: "10", offset: 1 }} className={cn("p-4", styles.container)}>
          {content}
          {stateContent}
        </Col>
      </Row>
    </Container>
  );
};

export const Kyc = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestLoading:
        state.kyc.individualRequestStateLoading || state.kyc.businessRequestStateLoading,
      individualRequestState: state.kyc.individualRequestState,
      businessRequestState: state.kyc.businessRequestState,
    }),
    dispatchToProps: () => ({
      reopenRequest: () => {},
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
