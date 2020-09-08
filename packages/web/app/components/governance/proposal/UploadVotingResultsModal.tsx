import { Button, CheckboxBase, EButtonLayout, TextField } from "@neufund/design-system";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import * as Yup from "yup";
import * as styles from "../../issuer-dashboard/NewVotingResolutionModal.module.scss";
import { Modal } from "../../modals/Modal";
import { EMimeType, Form } from "../../shared/forms";
import { EUploadType, MultiFileUploadComponent } from "../../shared/MultiFileUpload";

const VotingResultsSchema = Yup.object().shape({
  shareCapitalVotedYes: Yup.string().required(),
  shareCapitalVotedNo: Yup.string().required(),
  shareCapitalVotedAbstained: Yup.string().required(),
  iUnderstand: Yup.boolean().required(),
});

export const UploadVotingResultsModal = props => {
  return (
    <Modal isOpen={true} onClose={f => f} bodyClass={styles.modalBody}>
      <h4 className={styles.modalTitle}>
        <FormattedMessage id="governance.proposal.upload-voting-results-modal.title" />
      </h4>

      <FormattedHTMLMessage
        id="governance.proposal.upload-voting-results-modal.description"
        tagName="p"
        values={{nomineeName: "nomineeName"}}
      />

      <Form
        validationSchema={VotingResultsSchema}
        className={styles.form}
        validateOnMount
        initialValues={{}}
      >
        {({ values, ...formProps }) => {
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
                    fileName: 'Fifth Force GmbH Series C resolution results.pdf',
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
