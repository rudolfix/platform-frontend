import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";
import { ButtonPrimary } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";

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
    <ButtonPrimary onClick={props.onDone}>Close</ButtonPrimary>
  </div>
);

export const KYCCompanyDone = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.routing.goHome()),
    }),
  }),
)(KYCCompanyDoneComponent);
