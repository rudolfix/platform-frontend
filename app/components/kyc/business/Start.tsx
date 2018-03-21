import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { TKycBusinessType } from "../../../lib/api/KycApi.interfaces";
import { Button } from "../../shared/Buttons";
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
    <Button disabled={props.loading} onClick={() => props.setBusinessType("small")}>
      Small Business
    </Button>
    &nbsp;&nbsp;
    <Button disabled={props.loading} onClick={() => props.setBusinessType("corporate")}>
      Corporation
    </Button>
    &nbsp;&nbsp;
    <Button disabled={props.loading} onClick={() => props.setBusinessType("partnership")}>
      Partnership Business
    </Button>
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
