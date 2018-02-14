import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { Button } from "reactstrap";

interface IProps {
  submitForm: () => void;
}

export const KYCPersonalManualVerificationComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={5} currentStep={3} />
    <br />
    <h1>Manual Verification</h1>
    <br />
    Form goes here
    <br />
    <br />
    <br />
    <Button color="primary" onClick={props.submitForm}>
      Submit
    </Button>
  </div>
);

export const KYCPersonalManualVerification = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: () => dispatch(actions.kycSubmitManualVerificationForm()),
    }),
  }),
)(KYCPersonalManualVerificationComponent);
