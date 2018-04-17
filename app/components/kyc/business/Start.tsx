import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { TKycBusinessType } from "../../../lib/api/KycApi.interfaces";
import { Button } from "../../shared/Buttons";
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
    title="What type of company are you?"
    hasBackButton={true}
    isMaxWidth={true}
  >
    <Panels
      panels={[
        {
          content: (
            <Button
              theme="t-white"
              disabled={props.loading}
              onClick={() => props.setBusinessType("small")}
            >
              Small Business
            </Button>
          ),
          theme: PanelTheme.black,
          id: 1,
        },
        {
          content: (
            <Button
              theme="t-white"
              disabled={props.loading}
              onClick={() => props.setBusinessType("corporate")}
            >
              Corporation
            </Button>
          ),
          theme: PanelTheme.grey,
          id: 2,
        },
        {
          content: (
            <Button
              theme="t-white"
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
