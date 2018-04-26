import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { actions } from "../../../modules/actions";

import { FormField, FormSelectCountryField } from "../../shared/forms/forms";

import { Col, Row } from "reactstrap";
import { IEtoFileInfo } from "../../../lib/api/EtoApi.interfaces";
import {
  IKycBusinessData,
  IKycFileInfo,
  KycBusinessDataSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { KycPanel } from "../KycPanel";

interface IStateProps {
  currentValues?: IKycBusinessData;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[] | IEtoFileInfo[];
}

interface IDispatchProps {
  submitForm: (values: IKycBusinessData) => void;
  onDropFile: (file: File) => void;
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = injectIntlHelpers<FormikProps<IKycBusinessData> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => (
  <Form>
    <FormField label={formatIntlMessage("form.label.company-name")} name="name" />
    <FormField label={formatIntlMessage("form.label.legal-form")} name="legalForm" />
    <FormField label={formatIntlMessage("form.label.street-and-number")} name="street" />
    <Row>
      <Col xs={12} md={6} lg={8}>
        <FormField label={formatIntlMessage("form.label.city")} name="city" />
      </Col>
      <Col xs={12} md={6} lg={4}>
        <FormField label={formatIntlMessage("form.label.zip-code")} name="zipCode" />
      </Col>
    </Row>
    <FormSelectCountryField label={formatIntlMessage("form.label.country")} name="country" />
    {props.currentValues &&
      props.currentValues.legalFormType === "corporate" && (
        <FormSelectCountryField label={formatIntlMessage("form.label.jurisdiction")} name="jurisdiction" />
      )}
    <div className="p-4 text-center">
      <Button type="submit" disabled={!props.isValid || props.loadingData}>
        <FormattedMessage id="form.button.save" />
      </Button>
    </div>
  </Form>
));

const KYCEnhancedForm = withFormik<IProps, IKycBusinessData>({
  validationSchema: KycBusinessDataSchemaRequired,
  mapPropsToValues: props => props.currentValues as IKycBusinessData,
  enableReinitialize: true,
  isInitialValid: (props: any) => KycBusinessDataSchemaRequired.isValidSync(props.currentValues),
  handleSubmit: (values, props) => props.props.submitForm(values),
})(KYCForm);

const FileUploadList: React.SFC<IProps & { dataValid: boolean }> = props => {
  if (!props.dataValid) return <div />;
  return (
    <div>
      <br />
      <h4><FormattedMessage id="kyc.business.business-data.supporting-documents" /></h4>
      <br />
      <FormattedMessage id="kyc.business.business-data.upload-documents" />
      <br />
      <MultiFileUpload
        layout="business"
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
      />
    </div>
  );
};

export const KycBusinessDataComponent = injectIntlHelpers<IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => {
  const dataValid = KycBusinessDataSchemaRequired.isValidSync(props.currentValues);
  return (
    <KycPanel
      steps={5}
      currentStep={4}
      title={formatIntlMessage("kyc.business.business-data.title")}
      description={formatIntlMessage("kyc.business.business-data.description")}
      hasBackButton={true}
    >
      <KYCEnhancedForm {...props} />
      <FileUploadList {...props} dataValid={dataValid} />
      <div className="p-4 text-center">
        <Button
          type="submit"
          disabled={!props.currentValues || props.files.length === 0}
          onClick={props.submit}
        >
          <FormattedMessage id="form.button.continue" />
        </Button>
      </div>
    </KycPanel>
  );
});

export const KycBusinessData = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.businessData,
      loadingData: !!state.kyc.businessDataLoading,
      files: state.kyc.businessFiles,
      filesLoading: !!state.kyc.businessFilesLoading,
      fileUploading: !!state.kyc.businessFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadBusinessDocument(file)),
      submit: () => dispatch(actions.routing.goToKYCLegalRepresentative()),
      submitForm: (values: IKycBusinessData) => dispatch(actions.kyc.kycSubmitBusinessData(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadBusinessDocumentList());
    },
  }),
)(KycBusinessDataComponent);
