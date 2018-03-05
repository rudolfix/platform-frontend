import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { FormField } from "../../shared/forms/forms";

import {
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  KycLegalRepresentativeSchema,
} from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";
import { KycFileUploadList } from "../shared/KycFileUploadList";

interface IStateProps {
  currentValues?: IKycLegalRepresentative;
  loadingData: boolean;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
}

interface IDispatchProps {
  submitForm: (values: IKycIndividualData) => void;
  onDropFile: (file: File) => void;
  onContinue: () => void;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = (formikBag: FormikProps<IKycIndividualData> & IProps) => (
  <Form>
    <FormField
      label="First Name"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="firstName"
    />
    <FormField
      label="Last Name"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="lastName"
    />
    <FormField
      label="Birth Date"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="birthdate"
    />

    <FormField
      label="Address"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="address"
    />
    <FormField
      label="Zip Code"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="zipCode"
    />
    <FormField label="City" touched={formikBag.touched} errors={formikBag.errors} name="city" />
    <FormField
      label="Country"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="country"
    />
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

const KYCEnhancedForm = withFormik<IProps, IKycIndividualData>({
  validationSchema: KycLegalRepresentativeSchema,
  mapPropsToValues: props => props.currentValues as IKycIndividualData,
  isInitialValid: (props: any) => KycLegalRepresentativeSchema.isValidSync(props.currentValues),
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(KYCForm);

export const KycLegalRepresentativeComponent: React.SFC<IProps> = props => {
  return (
    <div>
      <br />
      <ProgressStepper steps={5} currentStep={3} />
      <br />
      <h3>Legal Representative</h3>
      <br />
      Please tell us about yourself
      <br />
      <br />
      <KYCEnhancedForm {...props} />
      <br />
      <h3>Supporting Documents</h3>
      <br />
      Please upload a scan of your ID here.
      <br />
      <KycFileUploadList
        onDropFile={props.onDropFile}
        files={props.files}
        fileUploading={props.fileUploading}
        filesLoading={props.filesLoading}
      />
      <br /> <br />
      <ButtonPrimary
        color="primary"
        type="submit"
        disabled={!props.currentValues || props.files.length === 0}
        onClick={props.onContinue}
      >
        Continue
      </ButtonPrimary>
    </div>
  );
};

export const KycLegalRepresentative = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      currentValues: state.kyc.legalRepresentative,
      loadingData: !!state.kyc.legalRepresentativeLoading,
      files: state.kyc.legalRepresentativeFiles,
      filesLoading: !!state.kyc.legalRepresentativeFilesLoading,
      fileUploading: !!state.kyc.legalRepresentativeFileUploading,
    }),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File) => dispatch(actions.kyc.kycUploadLegalRepresentativeDocument(file)),
      onContinue: () => dispatch(actions.routing.goToKYCBusinessData()),
      submitForm: (values: IKycIndividualData) =>
        dispatch(actions.kyc.kycSubmitLegalRepresentative(values)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadLegalRepresentative());
      dispatch(actions.kyc.kycLoadLegalRepresentativeDocumentList());
    },
  }),
)(KycLegalRepresentativeComponent);
