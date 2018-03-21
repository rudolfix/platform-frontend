import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";
import { ProgressStepper } from "../../shared/ProgressStepper";

import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { KycFileUploadList } from "../shared/KycFileUploadList";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCPersonalUploadComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={4} currentStep={3} />
    <br />
    <h1>Upload documents</h1>
    <br />
    Please submit a scan of the front and back of your identification document.
    <br />
    <br />
    <KycFileUploadList
      onDropFile={props.onDropFile}
      files={props.files}
      fileUploading={props.fileUploading}
      filesLoading={props.filesLoading}
    />
    <br />
    <Button onClick={props.onDone}>Submit Verification Request</Button>
  </div>
);

export const KYCPersonalUpload = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: state.kyc.individualFiles,
      filesLoading: !!state.kyc.individualFilesLoading,
      fileUploading: !!state.kyc.individualFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.kyc.kycSubmitIndividualRequest()),
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCPersonalUploadComponent);
