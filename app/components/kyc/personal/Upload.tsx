import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycPanel } from "../KycPanel";

interface IStateProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
}

interface IProps {
  layout: TKycRequestType;
}

export const KYCUploadComponent = injectIntlHelpers<IProps & IStateProps & IDispatchProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <KycPanel
      steps={5}
      currentStep={4}
      title={formatIntlMessage("kyc.personal.uploadId.title")}
      description={formatIntlMessage("kyc.personal.uploadId.description")}
      hasBackButton={true}
    >
      <MultiFileUpload
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
        layout="individual"
      />
      <div className="p-4 text-center">
        <Button onClick={props.onDone} disabled={!props.files || props.files.length === 0}>
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </KycPanel>
  ),
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
)(KYCUploadComponent);
