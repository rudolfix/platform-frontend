import { Button, EButtonLayout, EIconPosition } from "@neufund/design-system";
import { ECountries } from "@neufund/shared";
import * as cn from "classnames";
import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, ModalFooter, Row } from "reactstrap";

import {
  IKycBeneficialOwner,
  IKycFileInfo,
  IKycManagingDirector,
  KycBeneficialOwnerSchema,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { EBeneficialOwnerType } from "../../../modules/kyc/types";
import {
  getBeneficialOwnerCountry,
  getBeneficialOwnerId,
  validateBeneficiaryOwner,
} from "../../../modules/kyc/utils";
import {
  ECheckboxLayout,
  FormDeprecated,
  FormField,
  FormFieldDate,
  FormLabel,
  FormSelectCountryField,
  FormSelectField,
  FormSelectNationalityField,
  FormSelectStateField,
  RadioButtonLayout,
} from "../../shared/forms/index";
import { EKycUploadType, MultiFileUpload } from "../../shared/MultiFileUpload";
import { Tooltip } from "../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../shared/tooltips/TooltipBase";
import { PEP_VALUES } from "../shared/constants";
import { KYCModal, KYCModalTitle } from "../shared/KYCModal";
import { AcceptedKYCDocumentTypes } from "../utils";

import deleteIcon from "../../../assets/img/inline_icons/delete.svg";
import * as styles from "./BeneficialOwners.module.scss";

interface IDetailsModalProps {
  show: boolean;
  loading: boolean;
  currentValues: IKycBeneficialOwner | undefined;
  onSave: (values: IKycBeneficialOwner) => void;
  onDelete: () => void;
  onClose: () => void;
  onDropFile: (values: IKycManagingDirector, file: File, beneficialOwnerId?: string) => void;
  filesUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
  setType: (type: EBeneficialOwnerType) => void;
  type: EBeneficialOwnerType;
}

interface IFieldsProps {
  country?: string;
}

const PersonFields: React.FunctionComponent<IFieldsProps> = ({ country }) => (
  <>
    <Row>
      <Col xs={12} md={6} lg={6}>
        <FormField
          label={<FormattedMessage id="form.label.first-name" />}
          name="person.firstName"
          data-test-id="kyc-personal-start-first-name"
        />
      </Col>
      <Col xs={12} md={6} lg={6}>
        <FormField
          label={<FormattedMessage id="form.label.last-name" />}
          name="person.lastName"
          data-test-id="kyc-personal-start-last-name"
        />
      </Col>
    </Row>
    <FormFieldDate
      label={<FormattedMessage id="form.label.birth-date" />}
      name="person.birthDate"
    />
    <FormField
      label={<FormattedMessage id="form.label.street" />}
      name="person.street"
      data-test-id="kyc-personal-address-street"
    />
    <Row>
      <Col xs={12} md={6} lg={8}>
        <FormField label={<FormattedMessage id="form.label.city" />} name="person.city" />
      </Col>
      <Col xs={12} md={6} lg={4}>
        <FormField label={<FormattedMessage id="form.label.zip-code" />} name="person.zipCode" />
      </Col>
    </Row>
    <Row>
      <Col xs={12} md={6} lg={6}>
        <FormSelectCountryField
          label={<FormattedMessage id="form.label.place-of-birth" />}
          name="person.placeOfBirth"
          data-test-id="kyc-personal-start-place-of-birth"
        />
      </Col>
      <Col xs={12} md={6} lg={6}>
        <FormSelectNationalityField
          label={<FormattedMessage id="form.label.nationality" />}
          name="person.nationality"
          data-test-id="kyc-personal-start-nationality"
        />
      </Col>
    </Row>
    <FormSelectCountryField
      label={<FormattedMessage id="form.label.country" />}
      name="person.country"
    />
    {country === ECountries.UNITED_STATES && (
      <FormSelectStateField
        label={<FormattedMessage id="form.label.us-state" />}
        name="person.usState"
        data-test-id="kyc-company-business-data-us-state"
      />
    )}
    <FormSelectField
      values={PEP_VALUES}
      label={
        <>
          <FormattedMessage id="kyc.business.beneficial-owner.pep" />
          <Tooltip
            content={
              <FormattedHTMLMessage id="kyc.personal.politically-exposed.tooltip" tagName="span" />
            }
            textPosition={ECustomTooltipTextPosition.LEFT}
          />
        </>
      }
      name="person.isPoliticallyExposed"
    />
  </>
);

const BusinessFields: React.FunctionComponent<IFieldsProps> = ({ country }) => (
  <>
    <FormField
      data-test-id="kyc-company-business-data-company-name"
      label={<FormattedMessage id="form.label.company-name" />}
      name="business.name"
    />
    <FormField
      data-test-id="kyc-company-business-data-legal-form"
      label={<FormattedMessage id="form.label.legal-form" />}
      name="business.legalForm"
    />
    <FormField
      data-test-id="kyc-company-business-data-registration-number"
      label={<FormattedMessage id="form.label.company-registration-number.optional" />}
      name="business.registrationNumber"
    />
    <FormField
      data-test-id="kyc-company-business-data-street"
      label={<FormattedMessage id="form.label.street-and-number" />}
      name="business.street"
    />
    <Row>
      <Col xs={12} md={6} lg={8}>
        <FormField
          data-test-id="kyc-company-business-data-city"
          label={<FormattedMessage id="form.label.city" />}
          name="business.city"
        />
      </Col>
      <Col xs={12} md={6} lg={4}>
        <FormField
          data-test-id="kyc-company-business-data-zip-code"
          label={<FormattedMessage id="form.label.zip-code" />}
          name="business.zipCode"
        />
      </Col>
    </Row>
    <FormSelectCountryField
      data-test-id="kyc-company-business-data-country"
      label={<FormattedMessage id="form.label.country" />}
      name="business.country"
    />
    {country === ECountries.UNITED_STATES && (
      <FormSelectStateField
        label={<FormattedMessage id="form.label.us-state" />}
        name="business.usState"
        data-test-id="kyc-company-business-data-us-state"
      />
    )}
    <FormSelectCountryField
      data-test-id="kyc-company-business-data-jurisdiction"
      label={<FormattedMessage id="form.label.jurisdiction" />}
      name="business.jurisdiction"
    />
  </>
);

const BeneficialOwnerDetailsLayout: React.FunctionComponent<FormikProps<IKycBeneficialOwner> &
  IDetailsModalProps> = ({
  show,
  onClose,
  onSave,
  currentValues,
  values,
  onDropFile,
  files,
  filesUploading,
  onDelete,
  filesLoading,
  loading,
  type,
  setType,
}) => {
  const isFormValid = validateBeneficiaryOwner(type, values);
  const saveDisabled =
    !isFormValid || files.length === 0 || filesUploading || filesLoading || loading;

  const transformValuesForSave = (formValues: IKycBeneficialOwner) => ({
    [type]: {
      ...formValues[type],
      // TODO: Remove when not needed. This adds additional fields required by backend
      isHighIncome: false,
    },
  });
  const isSaved = !!(currentValues && getBeneficialOwnerId(currentValues));

  return (
    <KYCModal
      isOpen={show}
      onClose={onClose}
      title={
        <KYCModalTitle>
          <FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners.details" />
        </KYCModalTitle>
      }
      footer={
        <ModalFooter className={cn({ "justify-content-between": isSaved })}>
          {isSaved && (
            <Button
              className={cn("float-left", styles.deleteButton)}
              svgIcon={deleteIcon}
              layout={EButtonLayout.GHOST}
              iconPosition={EIconPosition.ICON_BEFORE}
              onClick={onDelete}
            >
              Remove
            </Button>
          )}
          <div>
            <Button
              layout={EButtonLayout.OUTLINE}
              onClick={onClose}
              className={styles.cancelButton}
            >
              <FormattedMessage id="form.button.cancel" />
            </Button>

            <Button
              layout={EButtonLayout.PRIMARY}
              disabled={saveDisabled}
              onClick={() => onSave(transformValuesForSave(values))}
              data-test-id="kyc-business-beneficial-owner-save"
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </div>
        </ModalFooter>
      }
    >
      <FormDeprecated>
        <div className="form-group">
          <FormLabel for="beneficialOwnerType">
            <FormattedMessage id="kyc.business.beneficial-owner.type" />
          </FormLabel>
          <RadioButtonLayout
            layout={ECheckboxLayout.BLOCK}
            name="beneficialOwnerType"
            checked={type === EBeneficialOwnerType.PERSON}
            value={EBeneficialOwnerType.PERSON}
            label="An individual"
            onChange={() => setType(EBeneficialOwnerType.PERSON)}
            disabled={isSaved}
          />
          <RadioButtonLayout
            layout={ECheckboxLayout.BLOCK}
            checked={type === EBeneficialOwnerType.BUSINESS}
            name="beneficialOwnerType"
            value={EBeneficialOwnerType.BUSINESS}
            label="A company"
            onChange={() => setType(EBeneficialOwnerType.BUSINESS)}
            disabled={isSaved}
            data-test-id="kyc-business-beneficial-owner-type-business"
          />
        </div>
        {type === EBeneficialOwnerType.PERSON ? (
          <PersonFields country={getBeneficialOwnerCountry(values)} />
        ) : (
          <BusinessFields country={getBeneficialOwnerCountry(values)} />
        )}
        <MultiFileUpload
          uploadType={EKycUploadType.PROOF_OF_ADDRESS_AND_IDENTITY}
          acceptedFiles={AcceptedKYCDocumentTypes}
          layout="vertical"
          onDropFile={file => onDropFile(transformValuesForSave(values), file)}
          files={files}
          filesUploading={filesUploading}
          data-test-id="kyc-upload-documents-dropzone"
        />
      </FormDeprecated>
    </KYCModal>
  );
};

const defaultEmptyObject = defaultTo<IKycBeneficialOwner | {}>({});

export const BeneficialOwnerDetails = withFormik<IDetailsModalProps, IKycBeneficialOwner>({
  validationSchema: KycBeneficialOwnerSchema,
  validateOnMount: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  enableReinitialize: true,
  handleSubmit: f => f,
})(BeneficialOwnerDetailsLayout);
