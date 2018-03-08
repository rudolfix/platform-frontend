import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { Form, FormikProps, withFormik } from "formik";
import {
  IKycBeneficialOwner,
  IKycFileInfo,
  KycBeneficialOwnerSchema,
} from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { ButtonPrimary, ButtonSecondary } from "../../shared/Buttons";
import { FormField, FormSelectCountryField } from "../../shared/forms/forms";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { KycFileUploadList } from "../shared/KycFileUploadList";

interface IStateProps {
  owner: IKycBeneficialOwner;
  index: number;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  loading: boolean;
  id: string;
}

interface IDispatchProps {
  submitForm: (owner: IKycBeneficialOwner) => void;
  loadDocumentList: () => void;
  submit: () => void;
  delete: () => void;
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  owner: IKycBeneficialOwner;
  index: number;
  id: string;
}

type IProps = IStateProps & IDispatchProps;

const KYCForm = (formikBag: FormikProps<IKycBeneficialOwner> & IProps) => {
  return (
    <Form>
      <FormField label="First Name" name="firstName" />
      <FormField label="Last Name" name="lastName" />
      <FormField label="Birth Date" name="birthDate" />

      <FormField label="Street and number" name="street" />
      <FormField label="Zip Code" name="zipCode" />
      <FormField label="City" name="city" />
      <FormSelectCountryField label="Country" name="country" />
      <FormField label="Percent owned" name="ownership" />
      <br />
      <br />
      <ButtonPrimary
        color="primary"
        type="submit"
        disabled={!formikBag.isValid || formikBag.loading}
      >
        Submit changes
      </ButtonPrimary>
    </Form>
  );
};

const KYCEnhancedForm = withFormik<IProps, IKycBeneficialOwner>({
  validationSchema: KycBeneficialOwnerSchema,
  mapPropsToValues: props => props.owner,
  isInitialValid: (props: any) => KycBeneficialOwnerSchema.isValidSync(props.currentValues),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    const ownership: any = values.ownership || "";
    props.props.submitForm({ ...values, ownership: parseInt(ownership, 10) || 0 });
  },
})(KYCForm);

export class KYCBeneficialOwnerComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadDocumentList();
  }

  render(): React.ReactChild {
    return (
      <div>
        <h3>Beneficial Owner {this.props.index + 1}</h3>
        <br />
        <KYCEnhancedForm {...this.props} />
        <br /> <br />
        <h4>Supporting Documents</h4>
        <br />
        Please update documents here
        <br />
        <KycFileUploadList
          onDropFile={this.props.onDropFile}
          files={this.props.files}
          fileUploading={this.props.fileUploading}
          filesLoading={this.props.filesLoading}
        />
        <ButtonSecondary onClick={this.props.delete}>Delete Beneficial Owner</ButtonSecondary>
        <br />
        <br />
        <HorizontalLine />
        <br />
        <br />
      </div>
    );
  }
}

export const KYCBeneficialOwner = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, ownProps) => ({
      id: ownProps.id,
      owner: ownProps.owner,
      index: ownProps.index,
      files: state.kyc.beneficialOwnerFiles[ownProps.id] || [],
      filesLoading: !!state.kyc.beneficialOwnerFilesLoading[ownProps.id],
      fileUploading: !!state.kyc.beneficialOwnerFileUploading[ownProps.id],
      loading: !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        dispatch(actions.kyc.kycUploadBeneficialOwnerDocument(ownProps.id, file)),
      submit: () => dispatch(actions.kyc.kycSubmitBusinessRequest()),
      loadDocumentList: () => dispatch(actions.kyc.kycLoadBeneficialOwnerDocumentList(ownProps.id)),
      submitForm: (owner: IKycBeneficialOwner) =>
        dispatch(actions.kyc.kycSubmitBeneficialOwner(owner)),
      delete: () => dispatch(actions.kyc.kycDeleteBeneficialOwner(ownProps.id)),
    }),
  }),
)(KYCBeneficialOwnerComponent);
