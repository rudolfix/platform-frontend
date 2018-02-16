import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/progressStepper/ProgressStepper";

import { actions } from "../../../modules/actions";

import { Button } from "reactstrap";

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
    <Button color="primary" onClick={props.uploadId}>
      Upload
    </Button>
  </div>
);

export const KYCPersonalIDUpload = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      uploadId: () => dispatch(actions.kycUploadId()),
    }),
  }),
)(KYCPersonalIDUploadComponent);
