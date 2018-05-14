import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import { selectUrlUserType } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { recoverRoutes } from "./recoverRoutes";

interface IStateProps {
  userType: TUserType;
}

interface IDispatchProps {
  goToDashboard: (userType: TUserType) => void;
}
// TODO: add translation
export const RecoverySuccessComponent: React.SFC<IStateProps & IDispatchProps> = ({
  goToDashboard,
  userType,
}) => (
  <div>
    <Col className="mt-4 pb-5">
      <HeaderProgressStepper headerText="Reset your Password" steps={8} currentStep={8} />
    </Col>
    <Col className="mt-4 mb-5 mx-auto">
      <h5 className="text-center">
        <i className="fa fa-check-circle mr-1" /> Great, you have a new password!
      </h5>
    </Col>
    <Row className="justify-content-center mb-5 mt-5 pt-4">
      <Col xs={6} sm={5} md={4} lg={3}>
        <Button
          onClick={() => goToDashboard(userType)}
          data-test-id="recovery-success-btn-go-dashboard"
        >
          GO TO DASHBOARD
        </Button>
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
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      userType: selectUrlUserType(s.router),
    }),
    dispatchToProps: dispatch => ({
      goToDashboard: (userType: TUserType) => dispatch(actions.walletSelector.connected(userType)),
    }),
  }),
)(RecoverySuccessComponent);
