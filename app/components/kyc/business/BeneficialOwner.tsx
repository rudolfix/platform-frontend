import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { Form, FormikProps, withFormik } from "formik";
import {
  IKycBeneficialOwner,
  IKycFileInfo,
  KycBeneficialOwnerSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { ButtonPrimary, ButtonSecondary } from "../../shared/Buttons";
import { KycFileUploadList } from "../shared/KycFileUploadList";

import { Col, Row } from "reactstrap";
import { AccordionElement } from "../../shared/Accordion";
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

const PEP_VALUES = {
  [NONE_KEY]: "-please select-",
  [BOOL_TRUE_KEY]: "Yes they are",
  [BOOL_FALSE_KEY]: "No they are not",
};

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
        label="Is this person politically exposed?"
        name="isPoliticallyExposed"
      />
      <Row>
        <Col xs={6} md={4}>
          <FormField label="Percent owned" name="ownership" />
        </Col>
      </Row>
      <ButtonPrimary
        color="primary"
        type="submit"
        disabled={!formikBag.isValid || formikBag.loading}
      >
        Save
      </ButtonPrimary>
    </Form>
  );
};

const KYCEnhancedForm = withFormik<IProps, IKycBeneficialOwner>({
  validationSchema: KycBeneficialOwnerSchemaRequired,
  mapPropsToValues: props => unboolify(props.owner),
  isInitialValid: (props: any) => KycBeneficialOwnerSchemaRequired.isValidSync(props.owner),
  enableReinitialize: true,
  handleSubmit: (values, props) => {
    const ownership: any = values.ownership || "";
    props.props.submitForm(boolify({ ...values, ownership: parseInt(ownership, 10) || 0 }));
  },
})(KYCForm);

export class KYCBeneficialOwnerComponent extends React.Component<IProps> {
  componentDidMount(): void {
    this.props.loadDocumentList();
  }

  render(): React.ReactChild {
    return (
      <AccordionElement title={`Beneficial Owner ${this.props.index + 1}`} isOpened={true}>
        <KYCEnhancedForm {...this.props} />
        <KycFileUploadList
          layout={"business"}
          onDropFile={this.props.onDropFile}
          files={this.props.files}
          fileUploading={this.props.fileUploading}
          filesLoading={this.props.filesLoading}
        />
        <ButtonSecondary onClick={this.props.delete}>Delete Beneficial Owner</ButtonSecondary>
      </AccordionElement>
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
