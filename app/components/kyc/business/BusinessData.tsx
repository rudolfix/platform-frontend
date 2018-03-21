import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { FormField } from "../../shared/forms/forms";

import {
  IKycBusinessData,
  IKycFileInfo,
  KycBusinessDataSchema,
} from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
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
  onContinue: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = (formikBag: FormikProps<IKycBusinessData> & IProps) => (
  <Form>
    <FormField label="Company Name" name="name" />
    <FormField label="Place of incorporation" name="jurisdictionOfIncorporation" />
    <FormField label="Legal Form" name="legalForm" />
    <br /> <br />
    <FormField
      label="Address"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="address"
    />
    <FormField label="Zip Code" name="zipCode" />
    <FormField label="City" touched={formikBag.touched} errors={formikBag.errors} name="city" />
    <FormField label="Country" name="country" />
    <br />
    <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
      Save
    </Button>
  </Form>
);

const KYCEnhancedForm = withFormik<IProps, IKycBusinessData>({
  validationSchema: KycBusinessDataSchema,
  mapPropsToValues: props => props.currentValues as IKycBusinessData,
  enableReinitialize: true,
  isInitialValid: (props: any) => KycBusinessDataSchema.isValidSync(props.currentValues),
  handleSubmit: (values, props) => props.props.submitForm(values),
})(KYCForm);

export const KycBusinessDataComponent: React.SFC<IProps> = props => {
  return (
    <div>
      <br />
      <ProgressStepper steps={5} currentStep={4} />
      <br />
      <h3>Business Information</h3>
      <br />
      Please tell us about your business
      <br />
      <br />
      <KYCEnhancedForm {...props} />
      <br />
      <h3>Supporting Documents</h3>
      <br />
      Please update documents here
      <br />
      <KycFileUploadList
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
      />
      <br /> <br />
      <Button
        layout="primary"
        type="submit"
        disabled={!props.currentValues || props.files.length === 0}
        onClick={props.onContinue}
      >
        Continue
      </Button>
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
      onContinue: () => dispatch(actions.routing.goToKYCBeneficialOwners()),
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
