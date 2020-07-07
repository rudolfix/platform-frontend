import { Button, EButtonLayout } from "@neufund/design-system";
import {
  IKycBeneficialOwner,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  kycApi,
  KycLegalRepresentativeSchema,
} from "@neufund/shared-modules";
import { ECountries } from "@neufund/shared-utils";
import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
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
} from "../../shared/forms";
import { EKycUploadType, MultiFileUpload } from "../../shared/MultiFileUpload";
import { Tooltip } from "../../shared/tooltips";
import { ECustomTooltipTextPosition } from "../../shared/tooltips/TooltipBase";
import { AddPersonButton } from "../shared/AddPersonButton";
import { PEP_VALUES } from "../shared/constants";
import { FooterButtons } from "../shared/FooterButtons";
import { KYCModal, KYCModalTitle } from "../shared/KYCModal";
import { KycStep } from "../shared/KycStep";
import { Person } from "../shared/Person";
import { AcceptedKYCDocumentTypes } from "../utils";

import * as styles from "../shared/KYCModal.module.scss";

export interface IStateProps {
  legalRepresentative?: IKycLegalRepresentative;
  loadingData: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  showModal: boolean;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
  onContinue: () => void;
  onSaveModal: (values: IKycLegalRepresentative) => void;
  goBack: () => void;
  toggleModal: (show: boolean) => void;
  saveAndClose: () => void;
}

interface IDetailsProps {
  currentValues?: IKycLegalRepresentative;
  onClose: () => void;
  onDropFile: (file: File) => void;
  onSave: (values: IKycBeneficialOwner) => void;
  show: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
}

type IProps = IStateProps & IDispatchProps;

const LegalRepresentativeDetails: React.FunctionComponent<FormikProps<IKycLegalRepresentative> &
  IDetailsProps> = ({
  show,
  onClose,
  onSave,
  values,
  onDropFile,
  files,
  filesUploading,
  filesLoading,
  isValid,
}) => {
  const saveDisabled = !isValid || files.length === 0 || filesLoading;

  return (
    <KYCModal
      isOpen={show}
      onClose={onClose}
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
            data-test-id="kyc-company-legal-representative-save"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </ModalFooter>
      }
      title={
        <KYCModalTitle>
          <FormattedMessage id="kyc.business.legal-representative.details" />
        </KYCModalTitle>
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
        <FormFieldDate label={<FormattedMessage id="form.label.birth-date" />} name="birthDate" />
        <FormField
          data-test-id="kyc-company-legal-representative-address"
          label={<FormattedMessage id="form.label.street" />}
          name="street"
        />
        <Row>
          <Col xs={12} md={6} lg={8}>
            <FormField
              data-test-id="kyc-company-legal-representative-city"
              label={<FormattedMessage id="form.label.city" />}
              name="city"
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <FormField
              data-test-id="kyc-company-legal-representative-zip-code"
              label={<FormattedMessage id="form.label.zip-code" />}
              name="zipCode"
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
          data-test-id="kyc-company-legal-representative-country"
          label={<FormattedMessage id="form.label.country" />}
          name="country"
        />
        {values.country === ECountries.UNITED_STATES && (
          <FormSelectStateField
            label={<FormattedMessage id="form.label.us-state" />}
            name="usState"
            data-test-id="kyc-company-legal-representative-us-state"
          />
        )}
        <FormSelectField
          data-test-id="kyc-company-legal-representative-pep"
          values={PEP_VALUES}
          label={
            <>
              <FormattedMessage id="kyc.business.legal-representative.pep" />
              <Tooltip
                content={
                  <FormattedHTMLMessage
                    tagName="div"
                    id="kyc.personal.politically-exposed.tooltip"
                  />
                }
                textPosition={ECustomTooltipTextPosition.LEFT}
              />
            </>
          }
          name="isPoliticallyExposed"
        />
        <br />
        <MultiFileUpload
          uploadType={EKycUploadType.PROOF_OF_ADDRESS_AND_IDENTITY}
          acceptedFiles={AcceptedKYCDocumentTypes}
          layout="vertical"
          onDropFile={onDropFile}
          files={files}
          filesUploading={filesUploading}
          data-test-id="kyc-upload-documents-dropzone"
        />
      </FormDeprecated>
    </KYCModal>
  );
};

const defaultEmptyObject = defaultTo<IKycIndividualData | {}>({});

const EnhancedLegalRepresentativeDetails = withFormik<IDetailsProps, IKycIndividualData>({
  validationSchema: KycLegalRepresentativeSchema,
  validateOnMount: true,
  enableReinitialize: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: f => f,
})(LegalRepresentativeDetails);

export const KycLegalRepresentativeLayout: React.FunctionComponent<IProps> = ({
  filesUploading,
  filesLoading,
  files,
  onDropFile,
  onContinue,
  goBack,
  onSaveModal,
  showModal,
  toggleModal,
  legalRepresentative,
  saveAndClose,
  loadingData,
}) => {
  const continueDisabled =
    loadingData ||
    (legalRepresentative &&
      (!KycLegalRepresentativeSchema.isValidSync(legalRepresentative) || files.length === 0));

  return (
    <>
      <KycStep
        step={5}
        allSteps={5}
        title={<FormattedMessage id="kyc.business.legal-representative.title" />}
        description={<FormattedMessage id="kyc.business.legal-representative.description" />}
        buttonAction={saveAndClose}
        data-test-id="kyc.panel.business-verification"
      />

      {legalRepresentative ? (
        <Person
          onClick={() => toggleModal(true)}
          name={`${legalRepresentative.firstName} ${legalRepresentative.lastName}`}
        />
      ) : (
        <AddPersonButton
          onClick={() => toggleModal(true)}
          dataTestId="kyc.business.legal-representative.add"
        >
          <FormattedMessage id="kyc.business.legal-representative.add" />
        </AddPersonButton>
      )}

      <EnhancedLegalRepresentativeDetails
        show={showModal}
        onSave={onSaveModal}
        onClose={() => toggleModal(false)}
        onDropFile={onDropFile}
        files={files}
        filesUploading={filesUploading}
        filesLoading={filesLoading}
        currentValues={legalRepresentative}
      />

      <FooterButtons
        onBack={goBack}
        onContinue={onContinue}
        continueButtonId="kyc-business-legal-representative-continue"
        continueDisabled={continueDisabled}
        skip={!legalRepresentative || files.length === 0}
      />
    </>
  );
};

export const KycLegalRepresentative = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => kycApi.selectors.selectLegalRepresentative(state),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadLegalRepresentativeDocument(file)),
      onContinue: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      onSaveModal: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitLegalRepresentative(values)),
      goBack: () => dispatch(actions.routing.goToKYCBeneficialOwners()),
      toggleModal: (show: boolean) => dispatch(actions.kyc.toggleLegalRepresentativeModal(show)),
      saveAndClose: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadLegalRepresentative());
      dispatch(actions.kyc.kycLoadLegalRepresentativeDocumentList());
    },
  }),
)(KycLegalRepresentativeLayout);
