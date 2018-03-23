import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { recoverRoutes } from "./recoverRoutes";

interface IProps {
  goToDashboard: () => void;
}

export const RecoverySuccessComponent: React.SFC<IProps> = props => (
  <div>
    <Col className="mt-4 pb-5">
      <HeaderProgressStepper
        headerText="Reset your Password"
        descText="Lorem ipsum"
        steps={8}
        currentStep={8}
      />
    </Col>
    <Col className="mt-4 mb-5 mx-auto">
      <h5 className="text-center">
        <i className="fa fa-check-circle mr-1" /> Great, you have a new password!
      </h5>
    </Col>
    <Row className="justify-content-center mb-5 mt-5 pt-4">
      <Col xs={6} sm={5} md={4} lg={4}>
        <Button onClick={props.goToDashboard}>GO TO DASHBOARD</Button>
      </Col>
    </Row>
    <Row className="justify-content-end mt-4 pt-4 align-bottom" noGutters>
      <Col className="align-bottom text-end">
        <Link className="" to={recoverRoutes.help}>
          Contact for help <i className="fa fa-lg fa-angle-right ml-1" />
        </Link>
      </Col>
    </Row>
  </div>
);

export const RecoverySuccess = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToDashboard: () => dispatch(actions.wallet.connected()),
    }),
  }),
)(RecoverySuccessComponent);
