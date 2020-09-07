import {
  Button,
  Checkbox,
  CheckboxBase,
  EButtonLayout,
  Eur,
  TextField,
} from "@neufund/design-system";
import { etoModuleApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import { compose } from "recompose";
import * as Yup from "yup";
import InfoIcon from "../../assets/img/info-outline.svg";
import { actions } from "../../modules/actions";
import { selectIssuerCompany, selectIssuerEtoPreviewCode } from "../../modules/eto-flow/selectors";
import { shareholderResolutionsVotingSetupModuleApi } from "../../modules/shareholder-resolutions-voting-setup/module";
import { appConnect } from "../../store";
import { Modal } from "../modals/Modal";
import { EMimeType, Form } from "../shared/forms";
import { injectIntlHelpers } from "../shared/hocs/injectIntlHelpers.unsafe";
import { EUploadType, MultiFileUploadComponent } from "../shared/MultiFileUpload";
import { ECustomTooltipTextPosition, Tooltip } from "../shared/tooltips";

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
  );
};

const NewVotingResolutionSummary = props => (
  <>
    <div className={styles.summary}>
      <FormattedHTMLMessage
        id="eto-dashboard.new-voting-resolution-modal.summary.description"
        tagName="p"
      />

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

const EnhancedNewVotingResolutionForm = compose()(injectIntlHelpers)(NewVotingResolutionForm);

const NewVotingResolutionModalLayout = ({ show, onClose, ...props }) => {
  const initialFormValues = {
    title: undefined,
    votingDuration: 10,
    includeExternalVotes: false,
    votingShareCapital: props.contract.totalInvestment.totalTokensInt,
    submissionDeadline: 6 * 7, // 6 weeks
  };

  const [showForm, setShowForm] = React.useState(false);
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
        <>
          <h4 className={styles.modalTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.title" />
          </h4>
          <EnhancedNewVotingResolutionForm
            {...props}
            shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
            shareCapital={props.shareCapital}
            initialFormValues={formValues}
            onNext={onNext}
          />
        </>
      ) : (
        <>
          <h4 className={styles.modalTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.title" />
          </h4>
          <NewVotingResolutionSummary
            onEdit={onEdit}
            values={formValues}
            shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
            onPublish={props.onPublish}
          />
        </>
      )}
    </Modal>
  );
};

export const NewVotingResolutionModal = compose(
  appConnect({
    stateToProps: state => ({
      company: selectIssuerCompany(state),
      contract: etoModuleApi.selectors.selectEtoContract(state, selectIssuerEtoPreviewCode(state)),
      isDocumentUploading: shareholderResolutionsVotingSetupModuleApi.selectors.isDocumentUploading(
        state,
      ),
      shareCapital: shareholderResolutionsVotingSetupModuleApi.selectors.selectShareCapital(state),
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onUploadDocument: file =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument(file)),
      onPublish: () => dispatch(actions.txTransactions.startShareholderVotingResolutionSetup()),
      getShareCapital: () =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.getShareCapital()),
    }),
  }),
)(NewVotingResolutionModalLayout);
