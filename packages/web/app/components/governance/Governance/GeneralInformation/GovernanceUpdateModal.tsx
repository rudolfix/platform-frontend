import {
  Button,
  EButtonLayout,
  EButtonSize,
  EButtonWidth,
  TextField,
} from "@neufund/design-system";
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";

import { GovernanceUpdateSchema, IResolutionUpdate } from "../../../../modules/governance/types";
import { IModalComponentProps, Modal } from "../../../modals/Modal";
import { EMimeType, FormDeprecated } from "../../../shared/forms";
import { EUploadType, MultiFileUploadComponent } from "../../../shared/MultiFileUpload";

import trashIcon from "../../../../assets/img/inline_icons/delete.svg";
import styles from "./GovernanceUpdateModal.module.scss";

interface IGovernanceUpdateModalProps {
  onPublish: (title: string) => void;
}

const GovernanceUpdateModalBase: React.FunctionComponent<FormikProps<IResolutionUpdate> &
  IModalComponentProps &
  IGovernanceUpdateModalProps> = props => {
  const [uploaded, setUploaded] = React.useState<boolean>(false);
  const publishDisabled = !props.isValid || !uploaded;

  React.useEffect(() => {
    setUploaded(false);
    props.handleReset();
  }, [props.isOpen]);

  return (
    <Modal
      unmountOnClose
      {...props}
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
            disabled={publishDisabled}
            onClick={() => props.onPublish(props.values.title)}
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
          name="title"
          data-test-id="governance-update-title"
        />
      </FormDeprecated>
      {uploaded ? (
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
            <span>Fifth Force GmbH financials 2020 for investors.pdf (19MB)</span>
            <Button
              svgIcon={trashIcon}
              iconProps={{ className: styles.deleteButton }}
              layout={EButtonLayout.LINK}
              size={EButtonSize.NORMAL}
              width={EButtonWidth.NO_PADDING}
              onClick={() => setUploaded(false)}
            />
          </div>
        </>
      ) : (
        <MultiFileUploadComponent
          layout={styles.multiFileUploadLayout}
          uploadType={EUploadType.SINGLE}
          dropZoneWrapperClass={styles.dropZoneWrapper}
          className={styles.dropZone}
          onDropFile={() => setUploaded(true)}
          acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
          filesUploading={false}
          data-test-id="general-information-update-upload-dropzone"
        />
      )}
    </Modal>
  );
};

export const GovernanceUpdateModal = withFormik<
  IModalComponentProps & IGovernanceUpdateModalProps,
  IResolutionUpdate
>({
  validationSchema: GovernanceUpdateSchema,
  validateOnMount: true,
  mapPropsToValues: () => ({ title: "" }),
  handleSubmit: f => f,
})(GovernanceUpdateModalBase);
