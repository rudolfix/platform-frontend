import * as cn from "classnames";
import * as React from "react";
import { compose } from "redux";

import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";

import {
  businessRequirements,
  individualRequirements,
  MultiFileUpload,
} from "../../shared/MultiFileUpload";

import * as bankStatementTemplate from "../../../assets/img/bank-statement-template.svg";
import * as documentBothSidesImage from "../../../assets/img/document-both-side.jpg";
import * as documentBothSidesImage2x from "../../../assets/img/document-both-side@2x.jpg";
import * as documentBothSidesImage3x from "../../../assets/img/document-both-side@3x.jpg";
import * as documentFrontImage from "../../../assets/img/document-front.jpg";
import * as documentFrontImage2x from "../../../assets/img/document-front@2x.jpg";
import * as documentFrontImage3x from "../../../assets/img/document-front@3x.jpg";

import { ResponsiveImage } from "../../shared/ResponsiveImage";
import * as styles from "./AddDocuments.module.scss";

interface IStateProps {
  fileUploading: boolean;
  files: IKycFileInfo[];
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
  const isIndividual = uploadType === "individual";
  const computedRequirements = isIndividual ? individualRequirements : businessRequirements;

  return (
    <div className={styles.upload}>
      {isIndividual && (
        <div className={styles.uploadInformationsWrapper}>
          <h3 className={styles.title}>
            Option 1 - If ID card has proof of address you only need to upload this document{" "}
          </h3>
          <h4 className={cn(styles.hint, "mb-3")}>*Coloured copy of both sides</h4>
          <ResponsiveImage
            srcSet={{
              "1x": documentBothSidesImage,
              "2x": documentBothSidesImage2x,
              "3x": documentBothSidesImage3x,
            }}
            alt="ID"
            width={344}
            height={111}
          />
          <h3 className={cn(styles.title, "my-4")}>
            Option 2 - Upload ID card / Passport + Utility bill / Bank statement{" "}
          </h3>
          <div className={styles.imagesWrapper}>
            <div className={styles.bankStatementWrapper}>
              <img src={bankStatementTemplate} alt="bank statement" />
            </div>
            <div className={styles.idWrapper}>
              <ResponsiveImage
                srcSet={{
                  "1x": documentFrontImage,
                  "2x": documentFrontImage2x,
                  "3x": documentFrontImage3x,
                }}
                alt="ID"
                width={133}
                height={94}
              />
            </div>
          </div>
        </div>
      )}
      <MultiFileUpload
        requirements={computedRequirements}
        acceptedFiles="image/*"
        onDropFile={onDropFile}
        files={files}
        fileUploading={fileUploading}
        uploadType={uploadType}
        layout="vertical"
      />
    </div>
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
