import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { TKycBusinessType } from "../../../lib/api/KycApi.interfaces";
import { Button } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";
import { KycPanel } from "../KycPanel";
import { Panels, PanelTheme } from "../shared/Panels";

interface IStateProps {
  loading: boolean;
}

interface IDispatchProps {
  setBusinessType: (type: TKycBusinessType) => void;
}

type IProps = IStateProps & IDispatchProps;

export const KycBusinessStartComponent: React.SFC<IProps> = props => (
  <KycPanel
    steps={5}
    currentStep={2}
    title={"What type of company are you?"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <Panels
      panels={[
        {
          content: (
            <ButtonPrimary disabled={props.loading} onClick={() => props.setBusinessType("small")}>
              Small Business
            </ButtonPrimary>
          ),
          theme: PanelTheme.black,
          id: 1,
        },
        {
          content: (
            <ButtonPrimary
              disabled={props.loading}
              onClick={() => props.setBusinessType("corporate")}
            >
              Corporation
            </ButtonPrimary>
          ),
          theme: PanelTheme.grey,
          id: 2,
        },
        {
          content: (
            <Button
              disabled={props.loading}
              onClick={() => props.setBusinessType("partnership")}
            >
              Partnership Business
            </Button>
          ),
          theme: PanelTheme.blue,
          id: 3,
        },
      ]}
    />
  </KycPanel>

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
