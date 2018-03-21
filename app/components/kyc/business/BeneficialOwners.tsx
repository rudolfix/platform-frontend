import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { IKycBeneficialOwner } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { ProgressStepper } from "../../shared/ProgressStepper";
import { KYCBeneficialOwner } from "./BeneficialOwner";

interface IStateProps {
  beneficialOwners: IKycBeneficialOwner[];
  loading: boolean;
}

interface IDispatchProps {
  submit: () => void;
  createBeneficialOwner: () => void;
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
    {props.beneficialOwners.map(
      (owner, index) =>
        owner.id ? (
          <KYCBeneficialOwner key={owner.id} owner={owner} index={index} id={owner.id} />
        ) : (
          <div />
        ),
    )}
    <HorizontalLine />
    <br />
    <br />
    <Button layout="secondary" onClick={props.createBeneficialOwner} disabled={props.loading}>
      Add new Beneficial Owner!
    </Button>
    <br />
    <br />
    <Button type="submit" onClick={props.submit} disabled={props.loading}>
      Submit Request
    </Button>
  </div>
);

export const KYCBeneficialOwners = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      beneficialOwners: state.kyc.beneficialOwners,
      loading: !!state.kyc.loadingBeneficialOwners || !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: dispatch => ({
      submit: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      createBeneficialOwner: () => dispatch(actions.kyc.kycAddBeneficialOwner()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBeneficialOwners());
    },
  }),
)(KYCBeneficialOwnersComponent);
