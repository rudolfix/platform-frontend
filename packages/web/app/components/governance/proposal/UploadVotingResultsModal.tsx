import { Button, CheckboxBase, EButtonLayout, TextField } from "@neufund/design-system";
import { EMimeType } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import * as Yup from "yup";
import * as styles from "./UploadVotingResultsModal.module.scss";
import { Modal } from "../../modals/Modal";
import { Form } from "../../shared/forms";
import { Heading } from "../../shared/Heading";
import { EUploadType, MultiFileUploadComponent } from "../../shared/MultiFileUpload";

const VotingResultsSchema = Yup.object().shape({
  shareCapitalVotedYes: Yup.string().required(),
  shareCapitalVotedNo: Yup.string().required(),
  shareCapitalVotedAbstained: Yup.string().required(),
  iUnderstand: Yup.boolean().required(),
});

type TExternalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadDocument: () => void;
  onNext: () => void;
};

export const UploadVotingResultsModal: React.FunctionComponent<TExternalProps> = props => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} bodyClass={styles.modalBody}>
      <Heading level={4} decorator={false}>
        <FormattedMessage id="governance.proposal.upload-voting-results-modal.title" />
      </Heading>

      <p className={styles.description}>
        <FormattedHTMLMessage
          id="governance.proposal.upload-voting-results-modal.description"
          tagName="span"
          values={{ nomineeName: "nomineeName" }}
        />
      </p>

      <Form
        validationSchema={VotingResultsSchema}
        className={styles.form}
        validateOnMount
        initialValues={{}}
        onSubmit={f=>f}
      >
        {({ values }) => {
          // console.log(values);
          // console.log(formProps);
          const disableSubmit = !props.isValid;

          return (
            <>
              <TextField
                label={
                  <FormattedMessage
                    id="governance.proposal.upload-voting-results-modal.form.shareCapitalVotedYes"
                    values={{ shareCapitalCurrencyCode: "PLN" }}
                  />
                }
                name="shareCapitalVotedYes"
              />

              <TextField
                label={
                  <FormattedMessage
                    id="governance.proposal.upload-voting-results-modal.form.shareCapitalVotedNo"
                    values={{ shareCapitalCurrencyCode: "PLN" }}
                  />
                }
                name="shareCapitalVotedYes"
              />

              <TextField
                label={
                  <FormattedMessage
                    id="governance.proposal.upload-voting-results-modal.form.shareCapitalVotedAbstained"
                    values={{ shareCapitalCurrencyCode: "PLN" }}
                  />
                }
                name="shareCapitalVotedAbstained"
              />

              <MultiFileUploadComponent
                layout={styles.multiFileUploadLayout}
                uploadType={EUploadType.SINGLE}
                uploadTitle={
                  <FormattedMessage id="governance.proposal.upload-voting-results-modal.form.upload-document" />
                }
                dropZoneWrapperClass={styles.dropZoneWrapper}
                className={styles.dropZone}
                onDropFile={props.onUploadDocument}
                acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
                filesUploading={props.isDocumentUploading}
                data-test-id="final-voting-results-upload-dropzone"
                files={[
                  {
                    id: "1",
                    fileName: "Fifth Force GmbH Series C resolution results.pdf",
                  },
                ]}
              />

              <CheckboxBase
                name="iUnderstand"
                label={
                  <FormattedMessage id="governance.proposal.upload-voting-results-modal.form.i-understand" />
                }
              />

              <ModalFooter className={styles.footer}>
                <Button
                  layout={EButtonLayout.PRIMARY}
                  disabled={disableSubmit && false}
                  onClick={() => props.onNext(values)}
                >
                  <FormattedMessage id="form.button.submit" />
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};
