import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { MultiFileUpload, TUploadListLayout } from "../../shared/MultiFileUpload";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  uploadType: "business" | "individual";
}

interface IProps {
  layout: TUploadListLayout;
}

export const KYCAddDocumentsComponent: React.SFC<
  IProps & IStateProps & IDispatchProps & IOwnProps
> = props => (
  <MultiFileUpload
    onDropFile={props.onDropFile}
    files={props.files}
    fileUploading={props.fileUploading}
    filesLoading={props.filesLoading}
    layout={props.uploadType}
  />
);

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
