import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { Button } from "reactstrap";

interface IProps {
  startInstantId: () => void;
  startManualVerification: () => void;
}

export const KYCPersonalInstantIDComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={4} currentStep={3} />
    <br />
    <h1>Instant Verfication</h1>
    <br />
    You will be redirected to our verification partner IDNow in order to complete a fast video
    verification via your desktop or mobile camera. After the successfull verification, you can
    mmediately invest and deposit funds on the NEUFUND platform.
    <br />
    <br />
    <Button color="primary" onClick={props.startInstantId}>
      Go to video verification
    </Button>
    <br />
    <br />
    <br />
    Optionally, fill out the form and upload your documents.  This verfcation method will a take 24h
    processing time.
    <br />
    <br />
    <Button onClick={props.startManualVerification}>Manual Verification</Button>
  </div>
);

export const KYCPersonalInstantID = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      startInstantId: () => dispatch(actions.kyc.kycStartPersonalInstantId()),
      startManualVerification: () => dispatch(actions.routing.goToKYCManualVerification()),
    }),
  }),
)(KYCPersonalInstantIDComponent);
