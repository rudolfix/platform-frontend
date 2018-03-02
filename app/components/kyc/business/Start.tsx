import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { TKycBusinessType } from "../../../lib/api/KycApi.interfaces";
import { ButtonPrimary } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";

interface IStateProps {
  loading: boolean;
}

interface IDispatchProps {
  setBusinessType: (type: TKycBusinessType) => void;
}

type IProps = IStateProps & IDispatchProps;

export const KycBusinessStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={5} currentStep={2} />
    <br />
    <h1>What type of company are you?</h1>
    <br />
    <br />
    <ButtonPrimary disabled={props.loading} onClick={() => props.setBusinessType("small")}>
      Small Business
    </ButtonPrimary>
    &nbsp;&nbsp;
    <ButtonPrimary disabled={props.loading} onClick={() => props.setBusinessType("corporate")}>
      Corporation
    </ButtonPrimary>
    &nbsp;&nbsp;
    <ButtonPrimary disabled={props.loading} onClick={() => props.setBusinessType("partnership")}>
      Partnership Business
    </ButtonPrimary>
    <br />
    <br />
  </div>
);

export const KycBusinessStart = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      loading: !!state.kyc.businessDataLoading,
    }),
    dispatchToProps: dispatch => ({
      setBusinessType: (type: TKycBusinessType) => dispatch(actions.kyc.kycSetBusinessType(type)),
    }),
  }),
)(KycBusinessStartComponent);
