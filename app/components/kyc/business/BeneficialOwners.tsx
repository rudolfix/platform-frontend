import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { IKycBeneficialOwner } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonSecondary } from "../../shared/Buttons";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { KYCBeneficialOwner } from "./BeneficialOwner";

interface IStateProps {
  beneficialOwners: IKycBeneficialOwner[];
  loading: boolean;
}

interface IDispatchProps {
  createBeneficialOwner: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <h3>Beneficial owners of your business</h3>
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
    <ButtonSecondary onClick={props.createBeneficialOwner} disabled={props.loading}>
      Add new Beneficial Owner!
    </ButtonSecondary>
    <br />
    <br />
  </div>
);

export const KYCBeneficialOwners = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      beneficialOwners: state.kyc.beneficialOwners,
      loading: !!state.kyc.loadingBeneficialOwners || !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: dispatch => ({
      createBeneficialOwner: () => dispatch(actions.kyc.kycAddBeneficialOwner()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBeneficialOwners());
    },
  }),
)(KYCBeneficialOwnersComponent);
