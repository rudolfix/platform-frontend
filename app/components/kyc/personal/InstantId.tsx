import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import { Button } from "../../shared/Buttons";
import { KycPanel } from "../KycPanel";
import { TUploadListLayout } from "../shared/KycFileUploadList";

interface IStateProps {}

interface IDispatchProps {
  onStartInstantId: () => void;
  onContinue: () => void;
}

interface IProps {
  layout: TUploadListLayout;
}

export const KycPersonalInstantIdComponent: React.SFC<
  IProps & IStateProps & IDispatchProps
> = props => (
  <KycPanel
    steps={5}
    currentStep={4}
    title={"Start Instant Verification"}
    description={
      "You will be redirected to our verification partner IDNow in order to complete a fast video verification via your desktop or mobile camera. After the successfull verification, you can mmediately invest and deposit funds on the NEUFUND platform."
    }
    hasBackButton={true}
  >
    <div className="p-4 text-center">
      <Button onClick={props.onStartInstantId}>Go to video verification</Button>
    </div>
    <div className="p-4 text-center">
      <Button layout="secondary" onClick={props.onContinue}>
        Upload Documents
      </Button>
    </div>
  </KycPanel>
);

export const KycPersonalInstantId = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onStartInstantId: () => dispatch(actions.kyc.kycStartInstantId()),
      onContinue: () => dispatch(actions.routing.goToKYCIndividualUpload()),
    }),
  }),
)(KycPersonalInstantIdComponent);
