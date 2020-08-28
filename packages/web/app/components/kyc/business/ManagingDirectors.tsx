import { Button, EButtonLayout } from "@neufund/design-system";
import {
  IKycBusinessData,
  IKycFileInfo,
  IKycManagingDirector,
  kycApi,
  KycManagingDirectorSchema,
} from "@neufund/shared-modules";
import { ECountries } from "@neufund/shared-utils";
import { FormikProps, withFormik } from "formik";
import defaultTo from "lodash/fp/defaultTo";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, ModalFooter, Row } from "reactstrap";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import {
  FormDeprecated,
  FormField,
  FormFieldDate,
  FormSelectCountryField,
  FormSelectField,
  FormSelectNationalityField,
  FormSelectStateField,
} from "../../shared/forms/index";
import { EKycUploadType, MultiFileUpload } from "../../shared/MultiFileUpload";
import { Tooltip } from "../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../shared/tooltips/TooltipBase";
import { AddPersonButton } from "../shared/AddPersonButton";
import { PEP_VALUES } from "../shared/constants";
import { FooterButtons } from "../shared/FooterButtons";
import { KYCModal, KYCModalTitle } from "../shared/KYCModal";
import { KycStep } from "../shared/KycStep";
import { Person } from "../shared/Person";
import { AcceptedKYCDocumentTypes } from "../utils";

import InfoIcon from "../../../assets/img/info-outline.svg";
import * as styles from "../shared/KYCModal.module.scss";

export interface IStateProps {
  currentValues: IKycManagingDirector | undefined;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  dataLoading: boolean;
  showModal: boolean;
}

interface IDispatchProps {
  goBack: () => void;
  onContinue: () => void;
  onSaveModal: (values: IKycManagingDirector) => void;
  onDropFile: (values: IKycManagingDirector, file: File) => void;
  setShowModal: (show: boolean) => void;
  saveAndClose: () => void;
}

type IProps = IStateProps & IDispatchProps;

interface IDetailsModalProps {
  currentValues: IKycManagingDirector;
  show: boolean;
  onSave: (values: IKycManagingDirector) => void;
  onClose: () => void;
  onDropFile: (values: IKycManagingDirector, file: File) => void;
  files: ReadonlyArray<IKycFileInfo>;
  filesUploading: boolean;
}

const ManagingDirectorDetails: React.FunctionComponent<FormikProps<IKycBusinessData> &
  IDetailsModalProps> = ({
  show,
  onClose,
  onSave,
  values,
  onDropFile,
  files,
  filesUploading,
  isValid,
}) => {
  const saveDisabled = !isValid || files.length === 0 || filesUploading;

  return (
    <KYCModal
      isOpen={show}
      onClose={onClose}
      title={
        <KYCModalTitle>
          <FormattedMessage id="kyc.business.managing-director.details" />
        </KYCModalTitle>
      }
      footer={
        <ModalFooter>
          <Button
            layout={EButtonLayout.SECONDARY}
            onClick={onClose}
            className={styles.cancelButton}
          >
            <FormattedMessage id="form.button.cancel" />
          </Button>

          <Button
            layout={EButtonLayout.PRIMARY}
            disabled={saveDisabled}
            onClick={() => onSave(values)}
            data-test-id="kyc.business.managing-director.save"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </ModalFooter>
      }
    >
      <FormDeprecated>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <FormField
              label={<FormattedMessage id="form.label.first-name" />}
              name="firstName"
              data-test-id="kyc-personal-start-first-name"
            />
          </Col>
          <Col xs={12} md={6} lg={6}>
            <FormField
              label={<FormattedMessage id="form.label.last-name" />}
              name="lastName"
              data-test-id="kyc-personal-start-last-name"
            />
          </Col>
        </Row>
        <FormFieldDate
          name="birthDate"
          label={<FormattedMessage id="form.label.birth-date" />}
          data-test-id="kyc-personal-start-birth-date"
        />
        <FormField
          label={<FormattedMessage id="form.label.street" />}
          name="street"
          data-test-id="kyc-personal-address-street"
        />
        <Row>
          <Col xs={12} md={6} lg={8}>
            <FormField
              label={<FormattedMessage id="form.label.city" />}
              name="city"
              data-test-id="kyc-personal-start-city"
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <FormField
              label={<FormattedMessage id="form.label.zip-code" />}
              name="zipCode"
              data-test-id="kyc-personal-start-zip-code"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <FormSelectCountryField
              label={<FormattedMessage id="form.label.place-of-birth" />}
              name="placeOfBirth"
              data-test-id="kyc-personal-start-place-of-birth"
            />
          </Col>
          <Col xs={12} md={6} lg={6}>
            <FormSelectNationalityField
              label={<FormattedMessage id="form.label.nationality" />}
              name="nationality"
              data-test-id="kyc-personal-start-nationality"
            />
          </Col>
        </Row>
        <FormSelectCountryField
          label={<FormattedMessage id="form.label.country" />}
          name="country"
          data-test-id="kyc-personal-start-country"
        />
        {values.country === ECountries.UNITED_STATES && (
          <FormSelectStateField
            label={<FormattedMessage id="form.label.us-state" />}
            name="usState"
            data-test-id="kyc-company-business-data-us-state"
          />
        )}
        <FormSelectField
          data-test-id="kyc-company-legal-representative-pep"
          values={PEP_VALUES}
          label={
            <span className="d-flex">
              <FormattedMessage id="kyc.business.beneficial-owner.pep" />
              <Tooltip
                content={
                  <FormattedHTMLMessage
                    id="kyc.personal.politically-exposed.tooltip"
                    tagName="span"
                  />
                }
                textPosition={ECustomTooltipTextPosition.LEFT}
              >
                <img src={InfoIcon} alt="" className="mt-n1" />
              </Tooltip>
            </span>
          }
          name="isPoliticallyExposed"
        />
      </FormDeprecated>
      <MultiFileUpload
        uploadType={EKycUploadType.PROOF_OF_ADDRESS_AND_IDENTITY}
        acceptedFiles={AcceptedKYCDocumentTypes}
        layout="vertical"
        onDropFile={file => onDropFile(values, file)}
        files={files}
        filesUploading={filesUploading}
        data-test-id="kyc-upload-documents-dropzone"
      />
    </KYCModal>
  );
};

const defaultEmptyObject = defaultTo<IKycManagingDirector | {}>({});

const ManagingDirectorDetailsForm = withFormik<IDetailsModalProps, IKycManagingDirector>({
  validationSchema: KycManagingDirectorSchema,
  validateOnMount: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: f => f,
})(ManagingDirectorDetails);

export const ManagingDirectorsComponent: React.FunctionComponent<IProps> = ({
  currentValues,
  filesUploading,
  filesLoading,
  files,
  onDropFile,
  onContinue,
  goBack,
  onSaveModal,
  showModal,
  setShowModal,
  saveAndClose,
  dataLoading,
}) => {
  const isFormValid = KycManagingDirectorSchema.isValidSync(currentValues);

  const continueDisabled =
    !currentValues ||
    !isFormValid ||
    files.length === 0 ||
    filesUploading ||
    filesLoading ||
    dataLoading;

  const onModalClose = () => setShowModal(false);

  return (
    <>
      <KycStep
        step={3}
        allSteps={5}
        title={<FormattedMessage id="kyc.steps.managing-directors.title" />}
        description={<FormattedMessage id="kyc.steps.managing-directors.description" />}
        buttonAction={saveAndClose}
        data-test-id="kyc.panel.business-verification"
      />

      {currentValues && currentValues.firstName ? (
        <Person
          onClick={() => setShowModal(true)}
          name={`${currentValues.firstName} ${currentValues.lastName}`}
        />
      ) : (
        <AddPersonButton
          onClick={() => setShowModal(true)}
          dataTestId="kyc.managing-directors.add-new"
        >
          <FormattedMessage id="kyc.steps.managing-directors.add-new" />
        </AddPersonButton>
      )}

      <FooterButtons
        onBack={goBack}
        onContinue={onContinue}
        continueButtonId="kyc-managing-director-continue"
        continueDisabled={continueDisabled}
      />

      {currentValues && (
        <ManagingDirectorDetailsForm
          show={showModal}
          onClose={onModalClose}
          onSave={onSaveModal}
          onDropFile={onDropFile}
          files={files}
          filesUploading={filesUploading}
          currentValues={currentValues}
        />
      )}
    </>
  );
};

export const ManagingDirectors = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => kycApi.selectors.selectManagingDirector(state),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCBusinessData()),
      onContinue: () => dispatch(actions.routing.goToKYCBeneficialOwners()),
      onSaveModal: values => dispatch(actions.kyc.kycSubmitManagingDirector(values)),
      onDropFile: (values: IKycManagingDirector, file: File) =>
        dispatch(actions.kyc.kycSubmitAndUploadManagingDirector(values, file)),
      setShowModal: (show: boolean) => dispatch(actions.kyc.kycToggleManagingDirectorModal(show)),
      saveAndClose: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadManagingDirector());
      dispatch(actions.kyc.kycLoadManagingDirectorDocumentList());
    },
  }),
)(ManagingDirectorsComponent);
