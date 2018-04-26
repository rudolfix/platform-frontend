import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import {
  BOOL_FALSE_KEY,
  BOOL_TRUE_KEY,
  boolify,
  FormField,
  FormSelectCountryField,
  FormSelectField,
  NONE_KEY,
  unboolify,
} from "../../shared/forms/forms";

import { KYCBeneficialOwners } from "./BeneficialOwners";

import { Col, Row } from "reactstrap";
import {
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  KycLegalRepresentativeSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycPanel } from "../KycPanel";

const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-i-am" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-i-am-not" />,
};

interface IStateProps {
  legalRepresentative?: IKycLegalRepresentative;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  businessData?: IKycBusinessData;
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  onDropFile: (file: File) => void;
  onContinue: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm  = injectIntlHelpers<FormikProps<IKycBusinessData> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
  <Form>
    <FormField label={formatIntlMessage("form.label.first-name")} name="firstName" />
    <FormField label={formatIntlMessage("form.label.last-name")} name="lastName" />
    <FormFieldDate label={formatIntlMessage("form.label.birth-date")} name="birthDate" />

    <FormField label={formatIntlMessage("form.label.address")} name="street" />
    <Row>
      <Col xs={12} md={6} lg={8}>
        <FormField label={formatIntlMessage("form.label.city")} name="city" />
      </Col>
      <Col xs={12} md={6} lg={4}>
        <FormField label={formatIntlMessage("form.label.zip-code")} name="zipCode" />
      </Col>
    </Row>
    <FormSelectCountryField label={formatIntlMessage("form.label.country")} name="country" />
    <FormSelectField
      values={PEP_VALUES}
      label={formatIntlMessage("kyc.business.legal-representative.pep")}
      name="isPoliticallyExposed"
    />
    <br />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!props.isValid || props.loadingData}>
      <FormattedMessage id="form.button.save" />,
      </Button>
    </div>
  </Form>
));

const KYCEnhancedForm = withFormik<IProps, IKycIndividualData>({
  validationSchema: KycLegalRepresentativeSchemaRequired,
  mapPropsToValues: props => unboolify(props.legalRepresentative as IKycIndividualData),
  isInitialValid: (props: any) =>
    KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative),
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(boolify(values)),
})(KYCForm);

const FileUploadList: React.SFC<IProps & { lrDataValid: boolean }> = props => {
  if (!props.lrDataValid) return <div />;
  return (
    <div>
      <MultiFileUpload
        layout="individual"
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
      />
    </div>
  );
};

const BeneficialOwners: React.SFC<IProps & { lrDataValid: boolean }> = props => {
  if (!props.lrDataValid || props.files.length === 0) return <div />;
  if (!props.businessData || !(props.businessData.legalFormType === "corporate")) return <div />;
  return <KYCBeneficialOwners />;
};

export const KycLegalRepresentativeComponent = injectIntlHelpers<IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => {
  const lrDataValid = KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative);
  return (
    <KycPanel
      steps={5}
      currentStep={3}
      title={formatIntlMessage("kyc.business.legal-representative.title")}
      description={formatIntlMessage("kyc.business.legal-representative.description")}
      hasBackButton={true}
    >
      <KYCEnhancedForm {...props} />
      <FileUploadList {...props} lrDataValid={lrDataValid} />
      <BeneficialOwners {...props} lrDataValid={lrDataValid} />
      <div className="p-4 text-center">
        <Button
          type="submit"
          disabled={!props.legalRepresentative || props.files.length === 0}
          onClick={props.onContinue}
        >
          <FormattedMessage id="form.button.submit-request" />
        </Button>
      </div>
    </KycPanel>
  );
});

export const KycLegalRepresentative = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      businessData: state.kyc.businessData,
      legalRepresentative: state.kyc.legalRepresentative,
      loadingData: !!state.kyc.legalRepresentativeLoading,
      files: state.kyc.legalRepresentativeFiles,
      filesLoading: !!state.kyc.legalRepresentativeFilesLoading,
      fileUploading: !!state.kyc.legalRepresentativeFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadLegalRepresentativeDocument(file)),
      onContinue: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitLegalRepresentative(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadLegalRepresentative());
      dispatch(actions.kyc.kycLoadLegalRepresentativeDocumentList());
    },
  }),
)(KycLegalRepresentativeComponent);
