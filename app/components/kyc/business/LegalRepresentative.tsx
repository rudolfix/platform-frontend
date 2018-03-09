import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

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

import {
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  KycLegalRepresentativeSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { ButtonPrimary } from "../../shared/Buttons";
import { KycFileUploadList } from "../shared/KycFileUploadList";

const PEP_VALUES = {
  [NONE_KEY]: "-please select-",
  [BOOL_TRUE_KEY]: "Yes I am",
  [BOOL_FALSE_KEY]: "No I am not",
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

const KYCForm = (formikBag: FormikProps<IKycIndividualData> & IProps) => (
  <Form>
    <FormField label="First Name" name="firstName" />
    <FormField label="Last Name" name="lastName" />
    <FormField label="Birth Date" name="birthDate" />

    <FormField label="Address" name="street" />
    <FormField label="Zip Code" name="zipCode" />
    <FormField label="City" name="city" />
    <FormSelectCountryField label="Country" name="country" />
    <FormSelectField
      values={PEP_VALUES}
      label="Are you politically exposed?"
      name="isPoliticallyExposed"
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
      <br />
      <h4>Supporting Documents</h4>
      <br />
      Please upload a scan of your ID here.
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

const BeneficialOwners: React.SFC<IProps & { lrDataValid: boolean }> = props => {
  if (!props.lrDataValid || props.files.length === 0) return <div />;
  if (!props.businessData || !(props.businessData.legalFormType === "corporate")) return <div />;
  return <KYCBeneficialOwners />;
};

export const KycLegalRepresentativeComponent: React.SFC<IProps> = props => {
  const lrDataValid = KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative);
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
      <FileUploadList {...props} lrDataValid={lrDataValid} />
      <BeneficialOwners {...props} lrDataValid={lrDataValid} />
      <br /> <br />
      <ButtonPrimary
        color="primary"
        type="submit"
        disabled={!props.legalRepresentative || props.files.length === 0}
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
      businessData: state.kyc.businessData,
      legalRepresentative: state.kyc.legalRepresentative,
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
      dispatch(actions.kyc.kycLoadBusinessData());
      dispatch(actions.kyc.kycLoadLegalRepresentative());
      dispatch(actions.kyc.kycLoadLegalRepresentativeDocumentList());
    },
  }),
)(KycLegalRepresentativeComponent);
