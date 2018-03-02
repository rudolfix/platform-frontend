import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";

interface IStateProps {}

interface IDispatchProps {
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={5} currentStep={5} />
    <br />
    <h1>Beneficial owners of your business</h1>
    <br />
    Please list and identify all shareholders with a stake of 25% or more in your company.
    <br />
    <br />
    <ButtonPrimary color="primary" type="submit" onClick={props.submit}>
      Submit Request
    </ButtonPrimary>
  </div>
);

export const KYCBeneficialOwners = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: () => ({}),
    dispatchToProps: dispatch => ({
      submit: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
    },
  }),
)(KYCBeneficialOwnersComponent);
