import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import { IKycFileInfo, kycApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { withProgress } from "../../../utils/react-connected-components/withProgress";
import { EKycUploadType, MultiFileUpload } from "../../shared/MultiFileUpload";
import { AcceptedKYCDocumentTypes } from "../utils";

import * as styles from "./Start.module.scss";

interface IStateProps {
  filesUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
  goBack: () => void;
}

export const KYCAdditionalUploadLayout: React.FunctionComponent<IStateProps &
  IDispatchProps> = props => (
  <>
    <MultiFileUpload
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={props.onDropFile}
      uploadType={EKycUploadType.ADDITIONAL_INDIVIDUAL}
      files={props.files}
      filesUploading={props.filesUploading}
      data-test-id="kyc-personal-upload-dropzone"
      layout="vertical"
    />

    <ButtonGroup className={styles.buttons}>
      <Button
        layout={EButtonLayout.SECONDARY}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-personal-start-go-back"
        onClick={props.goBack}
      >
        <FormattedMessage id="form.back" />
      </Button>
    </ButtonGroup>
  </>
);

export const KYCAdditionalUpload = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: kycApi.selectors.selectIndividualFiles(state),
      filesLoading: kycApi.selectors.selectIndividualFilesLoading(state),
      filesUploading: kycApi.selectors.selectIndividualFilesUploading(state),
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
      goBack: () => dispatch(actions.routing.goToKYCSuccess()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
  withProgress(() => ({ step: 5, allSteps: 5 })),
)(KYCAdditionalUploadLayout);
