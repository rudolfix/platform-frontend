import * as React from "react";

import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { Button } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";
import { KycPanel } from "../KycPanel";
import { Panels, PanelTheme } from "../shared/Panels";

interface IProps {
  goToPerson: () => void;
  goToCompany: () => void;
}

export const KYCStartComponent: React.SFC<IProps> = props => (
  <KycPanel
    steps={4}
    currentStep={1}
    title={"Start your KYC"}
    hasBackButton={false}
    isMaxWidth={true}
  >
    <Panels
      panels={[
        {
          content: <Button onClick={props.goToPerson}>I represent myself</Button>,
          theme: PanelTheme.black,
          id: 1,
        },
        {
          content: <Button onClick={props.goToCompany}>I represent a company</Button>,
          theme: PanelTheme.blue,
          id: 2,
        },
      ]}
    />
  </KycPanel>
);

export const KYCStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.routing.goToKYCIndividualStart()),
      goToCompany: () => dispatch(actions.routing.goToKYCBusinessStart()),
    }),
  }),
)(KYCStartComponent);
