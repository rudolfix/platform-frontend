import * as React from "react";

import { Button } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/progressStepper/ProgressStepper";

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const KYCStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={3} currentStep={1} />
    <br />
    <h1>Start your KYC</h1>
    <br />
    <Button color="primary" onClick={props.goToPerson}>
      I represent myself
    </Button>
    &nbsp;&nbsp;
    <Button color="primary" onClick={props.goToCompany}>
      I represent a company
    </Button>
  </div>
);

export const KYCStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.goToKYCPersonalStart()),
      goToCompany: () => dispatch(actions.goToKYCCompanyStart()),
    }),
  }),
)(KYCStartComponent);
