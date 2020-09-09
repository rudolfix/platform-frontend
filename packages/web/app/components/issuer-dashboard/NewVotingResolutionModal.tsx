import {
  Button,
  Checkbox,
  CheckboxBase,
  EButtonLayout,
  Eur,
  TextField,
} from "@neufund/design-system";
import { EEtoDocumentType, etoModuleApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import { compose } from "recompose";
import * as Yup from "yup";
import InfoIcon from "../../assets/img/info-outline.svg";
import { actions } from "../../modules/actions";
import { selectEtoDocumentUploadingByType } from "../../modules/eto-documents/selectors";
import {
  selectEtoNomineeDisplayName,
  selectIssuerCompany,
  selectIssuerEtoPreviewCode
} from "../../modules/eto-flow/selectors";
import {
  DEFAULT_SUBMISSION_DEADLINE_DAYS,
  DEFAULT_VOTING_DURATION_DAYS,
  shareholderResolutionsVotingSetupModuleApi,
  TVotingResolution,
} from "../../modules/shareholder-resolutions-voting-setup/module";
import { appConnect } from "../../store";
import { Modal } from "../modals/Modal";
import { EMimeType, Form } from "../shared/forms";
import { Heading } from "../shared/Heading";
import { injectIntlHelpers } from "../shared/hocs/injectIntlHelpers.unsafe";
import { EUploadType, MultiFileUploadComponent } from "../shared/MultiFileUpload";
import { ECustomTooltipTextPosition, Tooltip } from "../shared/tooltips";

import * as styles from "./NewVotingResolutionModal.module.scss";

const NewVotingResolutionForm = props => {
  return (
    <>
      <Heading level={4} decorator={false} className={styles.modalTitle}>
        <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.title" />
      </Heading>

      <Form
        validationSchema={VotingResolutionSchema}
        initialValues={props.initialFormValues}
        className={styles.form}
        validateOnMount
      >
        {({ values, ...formProps }) => {
          // console.log(values);
          // console.log(formProps);
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
                onDropFile={props.onUploadDocument}
                acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
                filesUploading={props.isDocumentUploading}
                data-test-id="new-voting-resolution-upload-dropzone"
                files={[
                  {
                    id: "1",
                    fileName: props.uploadedDocumentTitle,
                  },
                ]}
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
                      nomineeDisplayName: props.nomineeDisplayName
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
                  disabled={disableNext && false}
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
};

const NewVotingResolutionSummary = props => (
  <>
    <Heading level={4} decorator={false} className={styles.modalTitle}>
      <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.title" />
    </Heading>

    <div className={styles.summary}>
      <p className={styles.summaryDescription}>
        <FormattedHTMLMessage
          id="eto-dashboard.new-voting-resolution-modal.summary.description"
          tagName="span"
        />
      </p>

      <ul className={styles.summaryList}>
        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="form.label.title" />
          </span>
          <span className={styles.summaryItemValue}>{props.values.title}</span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-duration" />
          </span>
          <span className={styles.summaryItemValue}>
            {props.values.votingDuration} <FormattedMessage id="counter.label.days" />
          </span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.upload-resolution-document-uploaded" />
          </span>
          <span className={styles.summaryItemValue}>{props.values.votingDuration.document}</span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.will-include-external-shareholder-votes" />
          </span>

          <span className={styles.summaryItemValue}>
            {props.values.includeExternalVotes ? (
              <FormattedMessage id="form.select.yes" />
            ) : (
              <FormattedMessage id="form.select.no" />
            )}
          </span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage
              id="eto-dashboard.new-voting-resolution-modal.summary.total-voting-share-capital"
              values={{ shareCapitalCurrencyCode: props.shareCapitalCurrencyCode }}
            />
          </span>

          <span className={styles.summaryItemValue}>
            <Eur value={props.values.votingShareCapital} noSymbol />
          </span>
        </li>

        {props.values.includeExternalVotes && (
          <li className={styles.summaryItem}>
            <span className={styles.summaryItemTitle}>
              <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline" />
            </span>
            <span className={styles.summaryItemValue}>
              {props.values.submissionDeadline}{" "}
              <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline.units" />
            </span>
          </li>
        )}
      </ul>

      <CheckboxBase
        name="iUnderstand"
        label={
          <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.condition" />
        }
      />
    </div>

    <ModalFooter className={styles.footer}>
      <Button layout={EButtonLayout.SECONDARY} onClick={props.onEdit} className={styles.editButton}>
        <FormattedMessage id="form.button.edit" />
      </Button>
      <Button layout={EButtonLayout.PRIMARY} onClick={props.onPublish}>
        <FormattedMessage id="form.button.publish" />
      </Button>
    </ModalFooter>
  </>
);

const VotingResolutionSchema = Yup.object().shape({
  title: Yup.string().required(),
  votingDuration: Yup.number().required(),
  document: Yup.string(),
  includeExternalVotes: Yup.boolean().required(),
  votingShareCapital: Yup.number().required(),
  submissionDeadline: Yup.number().required(),
});

const EnhancedNewVotingResolutionForm = compose()(injectIntlHelpers)(NewVotingResolutionForm);

const NewVotingResolutionModalLayout = ({ show, onClose, ...props }) => {
  const initialFormValues = {
    title: undefined,
    votingDuration: DEFAULT_VOTING_DURATION_DAYS,
    includeExternalVotes: false,
    votingShareCapital: props.contract.totalInvestment.totalTokensInt,
    submissionDeadline: DEFAULT_SUBMISSION_DEADLINE_DAYS,
  };

  const [showForm, setShowForm] = React.useState(true);
  const [formValues, setFormValues] = React.useState(initialFormValues);

  const onNext = values => {
    console.log("onNext", values);
    setFormValues(values);
    setShowForm(false);
  };

  const onEdit = () => {
    setShowForm(true);
  };

  React.useEffect(() => {
    console.log("count changed");
    props.getShareCapital();
  }, [show]);

  return (
    <Modal isOpen={show} onClose={onClose} bodyClass={styles.modalBody}>
      {showForm ? (
        <EnhancedNewVotingResolutionForm
          {...props}
          shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
          shareCapital={props.shareCapital}
          initialFormValues={formValues}
          nomineeDisplayName={props.nomineeDisplayName}
          uploadedDocumentTitle={props.uploadedDocumentTitle}
          onNext={onNext}
        />
      ) : (
        <NewVotingResolutionSummary
          onEdit={onEdit}
          values={formValues}
          shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
          onPublish={() => props.onPublish(formValues)}
        />
      )}
    </Modal>
  );
};

export const NewVotingResolutionModal = compose(
  appConnect({
    stateToProps: state => ({
      nomineeDisplayName: selectEtoNomineeDisplayName(state),
      company: selectIssuerCompany(state),
      contract: etoModuleApi.selectors.selectEtoContract(state, selectIssuerEtoPreviewCode(state)),
      isDocumentUploading: selectEtoDocumentUploadingByType(
        state,
        EEtoDocumentType.RESOLUTION_DOCUMENT,
      ),
      uploadedDocumentTitle: "Fifth Force GmbH Series C fundraising information.pdf",
      shareCapital: shareholderResolutionsVotingSetupModuleApi.selectors.selectShareCapital(state),
    }),
    dispatchToProps: dispatch => ({
      onUploadDocument: file =>
        dispatch(
          actions.etoDocuments.etoUploadDocumentStart(file, EEtoDocumentType.RESOLUTION_DOCUMENT),
        ),
      onPublish: (votingResolution: TVotingResolution) =>
        dispatch(actions.txTransactions.startShareholderVotingResolutionSetup(votingResolution)),
      getShareCapital: () =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.getShareCapital()),
    }),
  }),
)(NewVotingResolutionModalLayout);
