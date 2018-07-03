import * as React from "react";
import { compose } from "redux";

import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { HorizontalLine } from "../../shared/HorizontalLine";
import {
  addressRequirements,
  businessRequirements,
  individualRequirements,
  MultiFileUpload,
} from "../../shared/MultiFileUpload";

import * as bankStatementTemplate from "../../../assets/img/bank-statement-template.svg";
import * as idImg from "../../../assets/img/id_img.svg";

interface IStateProps {
  fileUploading: boolean;
  files: IKycFileInfo[];
  title: TTranslatedString;
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
  title,
}) => {
  const isIndividual = uploadType === "individual";
  const computedRequirements = isIndividual ? individualRequirements : businessRequirements;
  const computedFileInfo = isIndividual ? "*Colour copies of both sides of ID card" : "";

  return (
    <>
      <MultiFileUpload
        documentTemplateImage={isIndividual && idImg}
        fileInfo={computedFileInfo}
        title={title}
        requirements={computedRequirements}
        acceptedFiles="image/*"
        onDropFile={onDropFile}
        files={files}
        fileUploading={fileUploading}
        uploadType={uploadType}
      />
      {isIndividual && (
        <>
          <HorizontalLine className="my-5" />
          <MultiFileUpload
            documentTemplateImage={bankStatementTemplate}
            title={"upload Utility Bill or bank statement "}
            fileInfo={"*If ID card has address then no extra proof of address is needed"}
            requirements={addressRequirements}
            acceptedFiles="application/pdf"
            onDropFile={onDropFile}
            files={files}
            fileUploading={fileUploading}
            uploadType={uploadType}
          />
        </>
      )}
    </>
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
