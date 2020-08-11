import { Button, EButtonLayout, EButtonSize, EButtonWidth, TTranslatedString, } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing } from "recompose";
import * as cn from 'classnames'

import { Modal } from "../../../modals/Modal";
import { EMimeType } from "../../../shared/forms";
import { EUploadType, MultiFileUploadComponent } from "../../../shared/MultiFileUpload";
import {
  EModalState,
  TDocumentUploadState,
  TGovernanceUpdateModalState,
  TGovernanceUpdateModalStateOpen, TTextFieldData
} from "../../../../modules/governance/reducer";
import { shouldNeverHappen } from "../../../shared/NeverComponent";
import { EProcessState } from "../../../../utils/enums/processStates";
import { LoadingIndicator } from "../../../shared/loading-indicator";
// import { GovernanceUpdateSchema } from "../../../../modules/governance/types";

import trashIcon from "../../../../assets/img/inline_icons/delete.svg";
import styles from "./GovernanceUpdateModal.module.scss";
import { TMessage } from "../../../translatedMessages/utils";
import { TDataTestId } from "@neufund/shared-utils";

type TGovernanceUpdateModalExternalProps = {
  uploadFile: (file: File) =>void;
  closeGovernanceUpdateModal: () =>void;
  publish: (title: string)=> void;
  updateForm:(formId: string, fieldPath:string,newValue:string) => void
}

type TGovernanceUpdateModalProps = TGovernanceUpdateModalExternalProps & TGovernanceUpdateModalStateOpen

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

type TFormErrorProps = {
  name: string,
  error: TMessage
} & TDataTestId

type TTextFieldProps = {
  data: TTextFieldData<string>,
  path:string,
  placeholder?:string,
  labelText:TTranslatedString,
}& TDataTestId

type TTextInputProps = {
  name:string,
  value:string,
  placeholder:string,
  isValid:boolean,
  disabled:boolean,
}& TDataTestId

type TFormLabelProps = {
  labelText:TTranslatedString,
  name:string,
  disabled:boolean
}

const FormLabel:React.FunctionComponent<TFormLabelProps> = ({
  labelText,
  name,
  disabled
}) =>
  <label htmlFor={name} className={cn(styles.label, { [styles.labelDisabled]: disabled })}>
    {labelText}
  </label>

const TextInput:React.FunctionComponent<TTextInputProps> = ({
  name,
  value,
  placeholder = "",
  isValid,
  disabled,
  'data-test-id':dataTestId
}) =>
  <input
    type="text"
    name={name}
    value={value}
    aria-describedby={`${name}-description`}
    aria-invalid={!isValid}
    disabled={disabled}
    placeholder={placeholder}
    data-test-id={dataTestId}

    onChange={()=>undefined}
  />



const FormError:React.FunctionComponent<TFormErrorProps> = ({
  error,
  'data-test-id':dataTestId
}) =>
  <p className={styles.errorMessage} data-test-id={`${dataTestId}-error`} role="alert">
    {error}
  </p>



const TextField:React.FunctionComponent<TTextFieldProps> = ({
  data: {
    value,
    error,
    isValid,
    disabled
  },
  path,
  'data-test-id':dataTestId,
  placeholder = "",
  labelText,
}) =>
  <div>
    {labelText && <FormLabel
      name={path}
      labelText={labelText}
      disabled={disabled}
    />}
    <TextInput
      name={path}
      value={value}
      placeholder={placeholder}
      isValid={isValid}
      disabled={disabled}
      data-test-id={dataTestId}
    />
    {error && <FormError
      name={path}
      error={error}
      data-test-id={dataTestId}
    />}
  </div>

export const GovernanceUpdateModalBase: React.FunctionComponent<TGovernanceUpdateModalProps> = ({
  publish,
  uploadFile,
  closeGovernanceUpdateModal,
  publishButtonDisabled,
  governanceUpdateTitleForm,
  documentUploadState,
  updateForm
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
      id="governanceUpdateTitleForm"
      onChange={(e)=>{console.log(e.target.name, "value",e.target.value);updateForm("governanceUpdateTitleForm",e.target.name,e.target.value)}}
      onBlur={undefined}
      onFocus={undefined}
    >
      <TextField
        path="updateTitle"
        data={governanceUpdateTitleForm.updateTitle}

        labelText={<FormattedMessage id="form.label.title" />}
        data-test-id="governance-update-title"
      />
    </form>

    <GovernanceUpdateModalDocumentDropzone
      {...documentUploadState}
      uploadFile={uploadFile}
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
        onClick={() => publish("safdasdf")} //fixme this should be in the saga
        data-test-id="general-information-publish"
      >
        <FormattedMessage id="common.publish" />
      </Button>
    </div>
  </Modal>
);


export const GovernanceUpdateModal = compose<TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps, TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps>(
  branch<TGovernanceUpdateModalState>(({ modalState }) => modalState === EModalState.CLOSED, renderNothing),
  branch<TGovernanceUpdateModalState & TGovernanceUpdateModalExternalProps>(({ modalState }) => modalState === EModalState.OPEN,
    renderComponent(GovernanceUpdateModalBase))
)(shouldNeverHappen("GovernanceUpdateModal reached default branch"))
