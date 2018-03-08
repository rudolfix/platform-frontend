import * as React from "react";
import { KycRouter } from "./Router";

import * as cn from "classnames";
import { Col, Container, Row } from "reactstrap";

import { compose } from "redux";
import { IKycRequestState } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
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

const RequestStateInfo: React.SFC<{ requestState?: IKycRequestState }> = props => {
  if (!props.requestState) {
    return <div>Loading ...</div>;
  }
  if (props.requestState.status === "pending") {
    return <div>We have received your request and are currently processing it. </div>;
  }
  if (props.requestState.status === "approved") {
    return <div>Your request has been approved!</div>;
  }
  if (props.requestState.status === "rejected") {
    return <div>Your request has been rejected!</div>;
  }
  return <div />;
};

export const KycComponent: React.SFC<IProps> = props => {
  const requestState =
    props.individualRequestState && props.individualRequestState.status === "draft"
      ? props.businessRequestState
      : props.individualRequestState;

  const router = requestState && requestState.status === "draft" ? <KycRouter /> : <div />;

  return (
    <Container>
      <Row>
        <Col lg="12" xl={{ size: "10", offset: 1 }} className={cn("p-4", styles.container)}>
          <RequestStateInfo requestState={requestState} />
          {router}
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
