import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { FormField, FormSelectCountryField } from "../../shared/forms/forms";

import {
  IKycBusinessData,
  IKycFileInfo,
  KycBusinessDataSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";
import { KycFileUploadList } from "../shared/KycFileUploadList";

interface IStateProps {
  currentValues?: IKycBusinessData;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
}

interface IDispatchProps {
  submitForm: (values: IKycBusinessData) => void;
  onDropFile: (file: File) => void;
  submit: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = (formikBag: FormikProps<IKycBusinessData> & IProps) => (
  <Form>
    <FormField label="Company Name" name="name" />
    <FormField label="Legal Form" name="legalForm" />
    {!formikBag.currentValues || !(formikBag.currentValues.legalFormType === "corporate") ? (
      <div />
    ) : (
      <FormSelectCountryField label="Jurisdiction of incorporation" name="jurisdiction" />
    )}
    <br /> <br />
    <FormField label="Street and number" name="street" />
    <FormField label="Zip Code" name="zipCode" />
    <FormField label="City" name="city" />
    <FormSelectCountryField label="Country" name="country" />
    <br />
    <ButtonPrimary
      color="primary"
      type="submit"
      disabled={!formikBag.isValid || formikBag.loadingData}
    >
      Save
    </ButtonPrimary>
  </Form>
);

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
      <h4>Supporting Documents</h4>
      <br />
      Please upload company documents here
      <br />
      <KycFileUploadList
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
      />{" "}
    </div>
  );
};

export const KycBusinessDataComponent: React.SFC<IProps> = props => {
  const dataValid = KycBusinessDataSchemaRequired.isValidSync(props.currentValues);
  return (
    <div>
      <br />
      <ProgressStepper steps={5} currentStep={4} />
      <br />
      <h3>Business Information</h3>
      <br />
      Please tell us about your business
      <br />
      <KYCEnhancedForm {...props} />
      <br />
      <FileUploadList {...props} dataValid={dataValid} />
      <br /> <br />
      <ButtonPrimary
        color="primary"
        type="submit"
        disabled={!props.currentValues || props.files.length === 0}
        onClick={props.submit}
      >
        Submit Request
      </ButtonPrimary>
    </div>
  );
};

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
      submit: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
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
