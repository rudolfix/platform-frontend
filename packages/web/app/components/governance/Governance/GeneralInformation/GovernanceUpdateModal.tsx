import { Button, EButtonLayout, EButtonSize, EButtonWidth, TextField, } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import { Modal } from "../../../modals/Modal";
import { EMimeType, FormDeprecated } from "../../../shared/forms";
import { EUploadType, MultiFileUploadComponent } from "../../../shared/MultiFileUpload";

import trashIcon from "../../../../assets/img/inline_icons/delete.svg";
import styles from "./GovernanceUpdateModal.module.scss";
import { branch, compose, renderComponent, renderNothing } from "recompose";
import {
  EModalState,
  TDocumentUploadState,
  TGovernanceUpdateModalState,
  TGovernanceUpdateModalStateOpen
} from "../../../../modules/governance/reducer";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { EProcessState } from "../../../../utils/enums/processStates";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { withFormik } from "formik";
import { GovernanceUpdateSchema } from "../../../../modules/governance/types";

type TGovernanceUpdateModalProps = {
  closeGovernanceUpdateModal: () => void;
  publish: (title: string) => void;
  uploadFile: (file: File) => void;
} & TGovernanceUpdateModalStateOpen

type TGovernanceUpdateModalDropzoneProps = {
  uploadFile: (file: File) => void;
} & TDocumentUploadState

export const GovernanceUpdateModalDocumentDropzone: React.FunctionComponent<TGovernanceUpdateModalDropzoneProps> = ({ uploadFile, ...props }) => {
  switch (props.documentUploadStatus) {
    case EProcessState.NOT_STARTED: {
      return (
        <MultiFileUploadComponent
          layout={styles.multiFileUploadLayout}
          uploadType={EUploadType.SINGLE}
          dropZoneWrapperClass={styles.dropZoneWrapper}
          className={styles.dropZone}
          onDropFile={uploadFile}
          acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
          filesUploading={false}
          data-test-id="general-information-update-upload-dropzone"
        />
      )
    }
    case EProcessState.SUCCESS: {
      return (
        <>
          <div>
            <h4 className={styles.fieldTitle}>
              <FormattedMessage id="common.upload-a-file" />
            </h4>
            <p className={styles.afterUploadMessage}>
              <FormattedMessage id="governance.after-update-file-upload" />
            </p>
          </div>
          <div className={styles.uploadedFile}>
            <span>{props.documentHash}</span>
            <Button
              svgIcon={trashIcon}
              iconProps={{ className: styles.deleteButton }}
              layout={EButtonLayout.LINK}
              size={EButtonSize.NORMAL}
              width={EButtonWidth.NO_PADDING}
              onClick={() => "remove"}
            />
          </div>
        </>
      )
    }
    case EProcessState.IN_PROGRESS:
      return <LoadingIndicator /> //fixme
    case EProcessState.ERROR:
      return (<>Error</>) //fixme
  }
}

export const GovernanceUpdateModalBase: React.FunctionComponent<TGovernanceUpdateModalProps> = ({
  publish,
  uploadFile,
  closeGovernanceUpdateModal,
  publishButtonDisabled,
  updateTitle,
  documentUploadState,
}) => (
  <Modal
    onClose={closeGovernanceUpdateModal}
    isOpen={true} //fixme try true
    unmountOnClose
    className={styles.modal}
    bodyClass={styles.modalBody}
    footer={
      <ModalFooter>
        <Button
          layout={EButtonLayout.SECONDARY}
          onClick={f => f}
          className={styles.saveAsDraft}
          disabled
        >
          <FormattedMessage id="common.save-as-draft" />
        </Button>

        <Button
          layout={EButtonLayout.PRIMARY}
          disabled={publishButtonDisabled}
          onClick={() => publish(updateTitle)} //fixme this should be in the saga
          data-test-id="general-information-publish"
        >
          <FormattedMessage id="common.publish" />
        </Button>
      </ModalFooter>
    }
  >
    <h4 className={styles.title}>
      <FormattedMessage id="governance.update-modal.title" />
    </h4>
    <FormDeprecated>
      <TextField
        label={<FormattedMessage id="form.label.title" />}
        name="updateTitle"
        data-test-id="governance-update-title"
        value={updateTitle}
      />
    </FormDeprecated>

    <GovernanceUpdateModalDocumentDropzone
      {...documentUploadState}
      uploadFile={uploadFile}
    />

  </Modal>
);

// export const GovernanceUpdateModal = withFormik<
//   IModalComponentProps & IGovernanceUpdateModalProps,
//   IResolutionUpdate
// >({
//   validationSchema: GovernanceUpdateSchema,
//   validateOnMount: true,
//   mapPropsToValues: () => ({ title: "" }),
//   handleSubmit: f => f,
// })(GovernanceUpdateModalBase);


export const GovernanceUpdateModal = compose<TGovernanceUpdateModalState, {}>(
  branch<TGovernanceUpdateModalState>(({ modalState }) => modalState === EModalState.CLOSED, renderNothing),
  branch<TGovernanceUpdateModalState>(({ modalState }) => modalState === EModalState.OPEN,
    renderComponent(
      withFormik({
        validationSchema: GovernanceUpdateSchema,
        handleSubmit: f => f,
      })(GovernanceUpdateModalBase)))
)(shouldNeverHappen("GovernanceUpdateModal reached default branch"))
