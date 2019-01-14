import * as React from "react";
import { compose } from "redux";

import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";

import { MultiFileUpload } from "../../shared/MultiFileUpload";

interface IStateProps {
  fileUploading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  uploadType: TKycRequestType;
}

export const KYCAddDocumentsComponent: React.SFC<IStateProps & IDispatchProps & IOwnProps> = ({
  onDropFile,
  files,
  fileUploading,
  uploadType,
}) => {
  return (
    <MultiFileUpload
      acceptedFiles="image/*,application/pdf"
      onDropFile={onDropFile}
      files={files}
      fileUploading={fileUploading}
      uploadType={uploadType}
      layout="vertical"
    />
  );
};

export const KYCAddDocuments = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, ownProps) => ({
      files:
        ownProps.uploadType === "individual" ? state.kyc.individualFiles : state.kyc.businessFiles,
      filesLoading:
        ownProps.uploadType === "individual"
          ? !!state.kyc.individualFilesLoading
          : !!state.kyc.businessFilesLoading,
      fileUploading:
        ownProps.uploadType === "individual"
          ? !!state.kyc.individualFileUploading
          : !!state.kyc.businessFileUploading,
      title: "",
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        ownProps.uploadType === "individual"
          ? dispatch(actions.kyc.kycUploadIndividualDocument(file))
          : dispatch(actions.kyc.kycUploadBusinessDocument(file)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCAddDocumentsComponent);
