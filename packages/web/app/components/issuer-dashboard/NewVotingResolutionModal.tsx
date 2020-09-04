import { Button, Checkbox, EButtonLayout, TextField } from "@neufund/design-system";
import { etoModuleApi } from "@neufund/shared-modules";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import { compose } from "recompose";
import * as Yup from "yup";
import InfoIcon from "../../assets/img/info-outline.svg";
import { selectIssuerEto } from "../../modules/eto-flow/selectors";
import { appConnect } from "../../store";
import { Modal } from "../modals/Modal";
import { EMimeType } from "../shared/forms";
import { Form } from "../shared/forms";
import { injectIntlHelpers } from "../shared/hocs/injectIntlHelpers.unsafe";
import { EUploadType, MultiFileUploadComponent } from "../shared/MultiFileUpload";
import { ECustomTooltipTextPosition, Tooltip } from "../shared/tooltips";
import { selectIssuerEtoPreviewCode } from "../../modules/eto-flow/selectors";

import * as styles from "./NewVotingResolutionModal.module.scss";

const NewVotingResolutionForm = props => {
  return (
    <Form
      validationSchema={VotingResolutionSchema}
      initialValues={props.initialFormValues}
      className={styles.form}
      validateOnMount
    >
      {({ values, ...formProps }) => {
        console.log(values);
        console.log(formProps);
        const disableNext = !props.isValid;

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
              onDropFile={() => setUploaded(true)}
              acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
              filesUploading={false}
              data-test-id="general-information-update-upload-dropzone"
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
                  <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-share-capital" />
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
                <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-share-capital.caption" />
              }
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
              <Button layout={EButtonLayout.PRIMARY} disabled={disableNext} onClick={f => f}>
                <FormattedMessage id="form.button.next" />
              </Button>
            </ModalFooter>
          </>
        );
      }}
    </Form>
  );
};

interface IVotingResolution {
  title: string;
  votingDuration: number;
  document: string;
  includeExternalVotes: boolean;
  votingShareCapital: number;
  submissionDeadline: number;
}

const VotingResolutionSchema = Yup.object().shape({
  title: Yup.string().required(),
  votingDuration: Yup.number().required(),
  document: Yup.string(),
  includeExternalVotes: Yup.boolean().required(),
  votingShareCapital: Yup.number().required(),
  submissionDeadline: Yup.number().required(),
});

const defaultEmptyObject = defaultTo<IVotingResolution | {}>({});

const EnhancedNewVotingResolutionForm = compose()(injectIntlHelpers)(NewVotingResolutionForm);

const NewVotingResolutionModalLayout = ({ show, onClose, ...props }) => {
  const initialFormValues = {
    title: undefined,
    votingDuration: 10,
    document: undefined,
    includeExternalVotes: false,
    votingShareCapital: props.contract.totalInvestment.totalTokensInt,
    submissionDeadline: undefined,
  };

  return (
    <Modal isOpen={show} onClose={onClose} bodyClass={styles.modalBody}>
      <h4 className={styles.modalTitle}>
        <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.title" />
      </h4>

      <EnhancedNewVotingResolutionForm
        {...props}
        currentValues={{
          votingDuration: 10,
        }}
        initialFormValues={initialFormValues}
      />
    </Modal>
  );
};

export const NewVotingResolutionModal = compose(
  appConnect({
    stateToProps: state => ({
      contract: etoModuleApi.selectors.selectEtoContract(state, selectIssuerEtoPreviewCode(state)),
    }),
    dispatchToProps: (dispatch, ownProps) => ({}),
  }),
)(NewVotingResolutionModalLayout);
