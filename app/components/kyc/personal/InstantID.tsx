import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ButtonPrimary } from "../../shared/Buttons";
import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

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
    <ButtonPrimary onClick={props.startInstantId}>Go to video verification</ButtonPrimary>
    <br />
    <br />
    <br />
    Optionally, fill out the form and upload your documents.  This verfcation method will a take 24h
    processing time.
    <br />
    <br />
    <ButtonPrimary onClick={props.startManualVerification}>Manual Verification</ButtonPrimary>
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
