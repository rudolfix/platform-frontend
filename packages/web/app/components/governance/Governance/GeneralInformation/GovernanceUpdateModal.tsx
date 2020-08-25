import {
  Button,
  EButtonLayout,
  EButtonSize,
  EButtonWidth,
  SimpleTextField,
} from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import {
  EModalState,
  TDocumentUploadState,
  TGovernanceUpdateModalState,
  TGovernanceUpdateModalStateOpen,
} from "../../../../modules/governance/reducer";
import { EProcessState } from "../../../../utils/enums/processStates";
import { Modal } from "../../../modals/Modal";
import { EMimeType } from "../../../shared/forms";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { EUploadType, MultiFileUploadComponent } from "../../../shared/MultiFileUpload";
import { shouldNeverHappen } from "../../../shared/NeverComponent";

import trashIcon from "../../../../assets/img/inline_icons/delete.svg";
import styles from "./GovernanceUpdateModal.module.scss";

type TGovernanceUpdateModalExternalProps = {
  uploadFile: (file: File) => void;
  removeFile: () => void;
  closeGovernanceUpdateModal: () => void;
  publishUpdate: () => void;
  onFormChange: (formId: string, fieldPath: string, newValue: string) => void;
  onFormBlur: (formId: string, fieldPath: string, newValue: string) => void;
  onFormFocus: (formId: string, fieldPath: string, newValue: string) => void;
  id: string;
};

type TGovernanceUpdateModalProps = TGovernanceUpdateModalExternalProps &
  TGovernanceUpdateModalStateOpen;

type TGovernanceUpdateModalDropzoneProps = {
  uploadFile: (file: File) => void;
  removeFile: () => void;
} & TDocumentUploadState;

export const DocumentUploadError = () => {};

export const GovernanceUpdateModalDocumentDropzone: React.FunctionComponent<TGovernanceUpdateModalDropzoneProps> = ({
  uploadFile,
  removeFile,
  ...props
}) => {
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
      );
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
            <span>{props.document.name}</span>
            <Button
              svgIcon={trashIcon}
              iconProps={{ className: styles.deleteButton }}
              layout={EButtonLayout.LINK}
              size={EButtonSize.NORMAL}
              width={EButtonWidth.NO_PADDING}
              onClick={removeFile}
            />
          </div>
        </>
      );
    }
    case EProcessState.IN_PROGRESS:
      return <LoadingIndicator />;
    case EProcessState.ERROR:
      return (
        <>
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
          <div className={styles.documentUploadError}>
            <FormattedMessage id="governance.upload-document-error" />
          </div>
        </>
      );
  }
};

export const GovernanceUpdateModalBase: React.FunctionComponent<TGovernanceUpdateModalProps> = ({
  publishUpdate,
  uploadFile,
  removeFile,
  closeGovernanceUpdateModal,
  publishButtonDisabled,
  governanceUpdateTitleForm,
  documentUploadState,
  onFormChange,
  onFormBlur,
  onFormFocus = () => undefined,
  id: formId,
}) => (
  <Modal
    onClose={closeGovernanceUpdateModal}
    isOpen={true}
    unmountOnClose
    className={styles.modal}
    bodyClass={styles.modalBody}
  >
    <h4 className={styles.title}>
      <FormattedMessage id="governance.update-modal.title" />
    </h4>
    <form
      id={formId}
      onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
        onFormChange(formId, e.target.name, e.target.value);
      }}
      onBlur={(e: React.ChangeEvent<HTMLFormElement>) => {
        onFormBlur(formId, e.target.name, e.target.value);
      }}
      onFocus={(e: React.FocusEvent<HTMLFormElement>) => {
        onFormFocus(formId, e.target.name, e.target.value);
      }}
    >
      <SimpleTextField
        path={governanceUpdateTitleForm.fields.updateTitle.id}
        data={governanceUpdateTitleForm.fields.updateTitle}
        labelText={<FormattedMessage id="form.label.title" />}
        data-test-id="governance-update-title"
      />
    </form>

    <GovernanceUpdateModalDocumentDropzone
      {...documentUploadState}
      uploadFile={uploadFile}
      removeFile={removeFile}
    />
    <div className={styles.footer}>
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
        onClick={publishUpdate}
        data-test-id="general-information-publish"
      >
        <FormattedMessage id="common.publish" />
      </Button>
    </div>
  </Modal>
);

export const GovernanceUpdateModal = compose<
  TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps,
  TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps
>(
  branch<TGovernanceUpdateModalState>(
    ({ modalState }) => modalState === EModalState.CLOSED,
    renderNothing,
  ),
  branch<TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps>(
    ({ modalState }) => modalState === EModalState.OPEN,
    renderComponent(GovernanceUpdateModalBase),
  ),
)(shouldNeverHappen("GovernanceUpdateModal reached default branch"));
