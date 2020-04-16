import { ECountries } from "@neufund/shared-utils";
import { FormikProps, withFormik } from "formik";
import { defaultTo } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "recompose";

import {
  EKycRequestType,
  IKycBusinessData,
  IKycFileInfo,
  KycBusinessDataSchema,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectBusinessData } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import {
  FormDeprecated,
  FormField,
  FormSelectCountryField,
  FormSelectStateField,
} from "../../shared/forms";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { FooterButtons } from "../shared/FooterButtons";
import { KycStep } from "../shared/KycStep";
import { AcceptedKYCDocumentTypes } from "../utils";

export interface IStateProps {
  currentValues?: IKycBusinessData;
  loadingData: boolean;
  filesUploading: boolean;
  filesLoading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onContinue: (values: IKycBusinessData, close?: boolean) => void;
  saveAndClose: (values: IKycBusinessData) => void;
  submitAndUpload: (values: IKycBusinessData, file: File) => void;
  goBack: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm: React.FunctionComponent<FormikProps<IKycBusinessData> & IProps> = ({
  values,
  filesUploading,
  filesLoading,
  loadingData,
  files,
  onContinue,
  goBack,
  submitAndUpload,
  isValid,
  saveAndClose,
}) => {
  const continueDisabled =
    filesLoading || filesUploading || !isValid || loadingData || files.length === 0;

  return (
    <>
      <KycStep
        step={2}
        allSteps={5}
        title={<FormattedMessage id="kyc.steps.company-details" />}
        description={<FormattedMessage id="kyc.steps.company-details.disclaimer" />}
        buttonAction={() => saveAndClose(values)}
        data-test-id="kyc.panel.business-verification"
      />
      <FormDeprecated>
        <FormField
          data-test-id="kyc-company-business-data-company-name"
          label={<FormattedMessage id="form.label.company-name" />}
          name="name"
        />
        <FormField
          data-test-id="kyc-company-business-data-legal-form"
          label={<FormattedMessage id="form.label.legal-form" />}
          name="legalForm"
        />
        <FormField
          data-test-id="kyc-company-business-data-registration-number"
          label={<FormattedMessage id="form.label.company-registration-number" />}
          name="registrationNumber"
        />
        <FormField
          data-test-id="kyc-company-business-data-street"
          label={<FormattedMessage id="form.label.street-and-number" />}
          name="street"
        />
        <Row>
          <Col xs={12} md={6} lg={8}>
            <FormField
              data-test-id="kyc-company-business-data-city"
              label={<FormattedMessage id="form.label.city" />}
              name="city"
            />
          </Col>
          <Col xs={12} md={6} lg={4}>
            <FormField
              data-test-id="kyc-company-business-data-zip-code"
              label={<FormattedMessage id="form.label.zip-code" />}
              name="zipCode"
            />
          </Col>
        </Row>
        <FormSelectCountryField
          data-test-id="kyc-company-business-data-country"
          label={<FormattedMessage id="form.label.country" />}
          name="country"
        />
        {values.country === ECountries.UNITED_STATES && (
          <FormSelectStateField
            label={<FormattedMessage id="form.label.us-state" />}
            name="usState"
            data-test-id="kyc-company-business-data-us-state"
          />
        )}
        <FormSelectCountryField
          data-test-id="kyc-company-business-data-jurisdiction"
          label={<FormattedMessage id="form.label.jurisdiction" />}
          name="jurisdiction"
        />
      </FormDeprecated>
      <div>
        <br />
        <h4>
          <FormattedMessage id="kyc.business.business-data.supporting-documents" />
        </h4>
        <br />
        <FormattedMessage id="kyc.business.business-data.upload-documents" />
        <br />
        <br />
        <MultiFileUpload
          uploadType={EKycRequestType.BUSINESS}
          acceptedFiles={AcceptedKYCDocumentTypes}
          data-test-id="kyc-company-business-supporting-documents"
          onDropFile={(file: File) => submitAndUpload(values, file)}
          files={files}
          filesUploading={filesUploading}
        />
      </div>
      <FooterButtons
        onBack={goBack}
        onContinue={() => onContinue(values)}
        continueButtonId="kyc-company-business-supporting-continue"
        continueDisabled={continueDisabled}
      />
    </>
  );
};

const defaultEmptyObject = defaultTo<IKycBusinessData | {}>({});

const KYCEnhancedForm = withFormik<IProps, IKycBusinessData>({
  validationSchema: KycBusinessDataSchema,
  validateOnMount: true,
  enableReinitialize: true,
  mapPropsToValues: props => defaultEmptyObject(props.currentValues),
  handleSubmit: (values, { props }) => props.onContinue(values),
})(KYCForm);

export const KycBusinessData = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => selectBusinessData(state),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCHome()),
      onContinue: (values: IKycBusinessData) => dispatch(actions.kyc.kycSubmitBusinessData(values)),
      saveAndClose: (values: IKycBusinessData) =>
        dispatch(actions.kyc.kycSubmitBusinessData(values, undefined, true)),
      submitAndUpload: (values: IKycBusinessData, file: File) =>
        dispatch(actions.kyc.kycSubmitBusinessData(values, file)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadBusinessDocumentList());
    },
  }),
)(KYCEnhancedForm);
