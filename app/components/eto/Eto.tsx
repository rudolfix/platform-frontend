import * as React from "react";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { selectKycOutourcedURL, selectKycRequestStatuts } from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoRouter } from "./Router";

interface IStateProps {}

interface IDispatchProps {}

type IProps = IStateProps & IDispatchProps;

export const EtoComponent: React.SFC<IProps> = () => {
  return (
    <LayoutAuthorized>
      <Row>
        <Col xs={12} lg={{ size: 8, offset: 2 }}>
          <EtoRouter />
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};

export const Eto = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({}),
    dispatchToProps: _dispatch => ({}),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoComponent);
