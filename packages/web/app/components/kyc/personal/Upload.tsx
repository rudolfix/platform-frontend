import { Button, ButtonGroup, EButtonLayout, EButtonSize } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, IKycFileInfo } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIndividualFilesUploading } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycStep } from "../shared/KycStep";
import { AcceptedKYCDocumentTypes } from "../utils";

import * as styles from "./Start.module.scss";

interface IStateProps {
  filesUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDone: () => void;
  onDropFile: (file: File) => void;
  goBack: () => void;
  goToDashboard: () => void;
}

interface IProps {
  layout: EKycRequestType;
}

type TComponentProps = IProps & IStateProps & IDispatchProps;

export const KYCUploadComponent: React.FunctionComponent<TComponentProps> = props => (
  <>
    <KycStep
      step={4}
      allSteps={5}
      title={<FormattedMessage id="kyc.personal.manual-verification.title" />}
      description={<FormattedMessage id="kyc.personal.manual-verification.description" />}
      buttonAction={() => props.goToDashboard()}
    />

    <MultiFileUpload
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={props.onDropFile}
      uploadType={EKycRequestType.INDIVIDUAL}
      files={props.files}
      filesUploading={props.filesUploading}
      data-test-id="kyc-personal-upload-dropzone"
      layout="vertical"
    />

    <ButtonGroup className={styles.buttons}>
      <Button
        layout={EButtonLayout.OUTLINE}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-personal-start-go-back"
        onClick={props.goBack}
      >
        <FormattedMessage id="form.back" />
      </Button>
      <Button
        layout={EButtonLayout.PRIMARY}
        size={EButtonSize.HUGE}
        className={styles.button}
        onClick={props.onDone}
        disabled={!props.files || props.files.length === 0}
        data-test-id="kyc-personal-upload-submit"
      >
        <FormattedMessage id="form.button.submit-request" />
      </Button>
    </ButtonGroup>
  </>
);

export const KYCPersonalUpload = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      files: state.kyc.individualFiles,
      filesLoading: !!state.kyc.individualFilesLoading,
      filesUploading: selectIndividualFilesUploading(state),
    }),
    dispatchToProps: dispatch => ({
      onDone: () => dispatch(actions.kyc.kycSubmitIndividualRequest()),
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadIndividualDocument(file)),
      goBack: () => dispatch(actions.routing.goToKYCIndividualDocumentVerification()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCUploadComponent);
