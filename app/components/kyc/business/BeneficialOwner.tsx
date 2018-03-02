import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";
import { onEnterAction } from "../../../utils/OnEnterAction";

interface IStateProps {}

interface IDispatchProps {
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.SFC<IProps> = () => <div />;

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
