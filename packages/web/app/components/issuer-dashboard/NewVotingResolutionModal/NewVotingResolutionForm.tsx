import { Button, Checkbox, EButtonLayout, Eur, TextField } from "@neufund/design-system";
import { TResolutionDocument } from "@neufund/shared-modules";
import { EMimeType } from "@neufund/shared-utils";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import InfoIcon from "../../../assets/img/info-outline.svg";
import {
  TVotingResolutionSetupData,
  VotingResolutionSchema,
} from "../../../modules/shareholder-resolutions-voting-setup/types";
import { Form } from "../../shared/forms";
import { Heading } from "../../shared/Heading";
import { IIntlProps, injectIntlHelpers } from "../../shared/hocs/injectIntlHelpers.unsafe";
import { EUploadType, MultiFileUploadComponent } from "../../shared/MultiFileUpload";
import { ECustomTooltipTextPosition, Tooltip } from "../../shared/tooltips";
import * as styles from "./NewVotingResolutionModal.module.scss";
import * as React from "react";
import { ModalFooter } from "reactstrap";
import { compose } from "recompose";

type TProps = {
  initialFormValues: TVotingResolutionSetupData;
  shareCapital: string;
  shareCapitalCurrencyCode: string;
  nomineeDisplayName: string;
  isDocumentUploading: boolean;
  uploadedDocument: TResolutionDocument;
  onUploadDocument: (file: File) => void;
  onRemoveDocument: () => void;
  onNext: (values: TVotingResolutionSetupData) => void;
};

const NewVotingResolutionForm: React.FunctionComponent<TProps & IIntlProps> = props => (
  <>
    <Heading level={4} decorator={false} className={styles.modalTitle}>
      <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.title" />
    </Heading>

    <Form
      validationSchema={VotingResolutionSchema}
      initialValues={props.initialFormValues}
      className={styles.form}
      validateOnMount
      onSubmit={f => f}
    >
      {({ values, isValid, ...formProps }) => {
        // console.log(values);
        console.log(formProps);
        const disableNext = !isValid || !props.uploadedDocument;

        return (
          <>
            <TextField
              label={<FormattedMessage id="form.label.title" />}
              name="title"
              placeholder={props.intl.formatIntlMessage(
                "eto-dashboard.new-voting-resolution-modal.title.placeholder",
              )}
            />

            <TextField
              label={
                <span className="d-flex">
                  <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-duration" />
                  <Tooltip
                    content={
                      <FormattedHTMLMessage
                        id="eto-dashboard.new-voting-resolution-modal.form.voting-duration.tooltip"
                        tagName="span"
                      />
                    }
                    textPosition={ECustomTooltipTextPosition.LEFT}
                  >
                    <img src={InfoIcon} alt="" className="mt-2" />
                  </Tooltip>
                </span>
              }
              name="votingDuration"
              smallWidth
              units={
                <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-duration.units" />
              }
            />

            <MultiFileUploadComponent
              layout={styles.multiFileUploadLayout}
              uploadType={EUploadType.SINGLE}
              uploadTitle={
                <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.upload-resolution-document" />
              }
              dropZoneWrapperClass={styles.dropZoneWrapper}
              className={styles.dropZone}
              onDropFile={props.onUploadDocument}
              acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
              filesUploading={props.isDocumentUploading}
              data-test-id="new-voting-resolution-upload-dropzone"
              uploadedState={
                <div className={styles.afterUploadMessage}>
                  <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.upload-resolution-document-uploaded-message" />
                </div>
              }
              files={
                props.uploadedDocument
                  ? [
                      {
                        id: props.uploadedDocument.resolutionId,
                        fileName: props.uploadedDocument.name,
                      },
                    ]
                  : []
              }
              onDelete={props.onRemoveDocument}
            />

            <Checkbox
              name="includeExternalVotes"
              label={
                <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.include-external-shareholder-votes" />
              }
            />

            <TextField
              label={
                <span className="d-flex">
                  <FormattedMessage
                    id="eto-dashboard.new-voting-resolution-modal.form.voting-share-capital"
                    values={{ shareCapitalCurrencyCode: props.shareCapitalCurrencyCode }}
                  />
                  <Tooltip
                    content={
                      <FormattedHTMLMessage
                        id="eto-dashboard.new-voting-resolution-modal.form.voting-share-capital.tooltip"
                        tagName="span"
                      />
                    }
                    textPosition={ECustomTooltipTextPosition.LEFT}
                  >
                    <img src={InfoIcon} alt="" className="mt-2" />
                  </Tooltip>
                </span>
              }
              name="votingShareCapital"
              description={
                <FormattedMessage
                  id="eto-dashboard.new-voting-resolution-modal.form.voting-share-capital.caption"
                  values={{
                    shareCapital: <Eur value={props.shareCapital} noSymbol />,
                    shareCapitalCurrencyCode: props.shareCapitalCurrencyCode,
                    nomineeDisplayName: props.nomineeDisplayName,
                  }}
                />
              }
              disabled={!values.includeExternalVotes}
            />

            {values.includeExternalVotes && (
              <TextField
                label={
                  <span className="d-flex">
                    <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline" />
                    <Tooltip
                      content={
                        <FormattedHTMLMessage
                          id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline.tooltip"
                          tagName="span"
                        />
                      }
                      textPosition={ECustomTooltipTextPosition.LEFT}
                    >
                      <img src={InfoIcon} alt="" className="mt-2" />
                    </Tooltip>
                  </span>
                }
                name="submissionDeadline"
                smallWidth
                units={
                  <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline.units" />
                }
              />
            )}

            <ModalFooter className={styles.footer}>
              <Button
                layout={EButtonLayout.PRIMARY}
                disabled={disableNext}
                onClick={() => props.onNext(values)}
              >
                <FormattedMessage id="form.button.next" />
              </Button>
            </ModalFooter>
          </>
        );
      }}
    </Form>
  </>
);

export const EnhancedNewVotingResolutionForm = compose<TProps & IIntlProps, {}>(injectIntlHelpers)(
  NewVotingResolutionForm,
);
