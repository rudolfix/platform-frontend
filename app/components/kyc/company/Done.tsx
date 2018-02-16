import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";
import { ProgressStepper } from "../../shared/ProgressStepper";

import { Button } from "reactstrap";

interface IProps {
  onDone: () => void;
}

export const KYCCompanyDoneComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={3} currentStep={3} />
    <br />
    <h1>Thank you for submitting your KYC request</h1>
    <br />
    We will get back to you shortly
    <br />
    <br />
    <br />
    <Button color="primary" onClick={props.onDone}>
      Close
    </Button>
  </div>
);

export const KYCCompanyDone = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.routing.goHome()),
    }),
  }),
)(KYCCompanyDoneComponent);
