import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";

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
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
import { KycPanel } from "../KycPanel";
import { MultiFileUpload } from "../../shared/MultiFileUpload";

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
    <FormFieldDate label="Birthdate" name="birthDate" />

    <FormField label="Address" name="street" />
    <Row>
      <Col xs={12} md={6} lg={8}>
        <FormField label="City" name="city" />
      </Col>
      <Col xs={12} md={6} lg={4}>
        <FormField label="Zip Code" name="zipCode" />
      </Col>
    </Row>
    <FormSelectCountryField label="Country" name="country" />
    <FormSelectField
      values={PEP_VALUES}
      label="Are you politically exposed?"
      name="isPoliticallyExposed"
    />
    <br />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Save
      </Button>
    </div>
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
      <MultiFileUpload
        layout="personal"
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

export const KycLegalRepresentativeComponent: React.SFC<IProps> = props => {
  const lrDataValid = KycLegalRepresentativeSchemaRequired.isValidSync(props.legalRepresentative);
  return (
    <KycPanel
      steps={5}
      currentStep={3}
      title={"Legal Representative"}
      description={"Please tell us about yourself"}
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
          Submit Request
        </Button>
      </div>
    </KycPanel>
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
