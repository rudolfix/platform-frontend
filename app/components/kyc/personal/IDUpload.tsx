import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";
import { ButtonPrimary } from "../../shared/Buttons";
interface IProps {
  uploadId: () => void;
}

export const KYCPersonalIDUploadComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={5} currentStep={4} />
    <br />
    <h1>ID Upload</h1>
    <br />
    Please upload a scan of the front and the back of your ID card or passport here
    <br />
    <br />
    <br />
    <ButtonPrimary onClick={props.uploadId}>Upload</ButtonPrimary>
  </div>
);

export const KYCPersonalIDUpload = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      uploadId: () => dispatch(actions.kyc.kycUploadId()),
    }),
  }),
)(KYCPersonalIDUploadComponent);
