import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { ButtonPrimary } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const KYCStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={4} currentStep={1} />
    <br />
    <h1>Start your KYC</h1>
    <br />
    <ButtonPrimary onClick={props.goToPerson}>I represent myself</ButtonPrimary>
    &nbsp;&nbsp;
    <ButtonPrimary onClick={props.goToCompany}>I represent a company</ButtonPrimary>
  </div>
);

export const KYCStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.routing.goToKYCIndividualStart()),
      goToCompany: () => dispatch(actions.routing.goToKYCBusinessStart()),
    }),
  }),
)(KYCStartComponent);
