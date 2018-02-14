import * as React from "react";

import { Button } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const StartKYCComponent: React.SFC<IProps> = props => (
  <div>
    <h1>Start</h1>
    <Button color="primary" onClick={props.goToPerson}>
      I am a person
    </Button>
    <Button color="primary" onClick={props.goToCompany}>
      I am a company
    </Button>
  </div>
);

export const StartKYC = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.goToKYCStartPrivateFlow()),
      goToCompany: () => dispatch(actions.goToKYCStartCompanyFlow()),
    }),
  }),
)(StartKYCComponent);
