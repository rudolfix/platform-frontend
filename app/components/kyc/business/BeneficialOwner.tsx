import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { Form, FormikProps, withFormik } from "formik";
import {
  IKycBeneficialOwner,
  IKycFileInfo,
  KycBeneficialOwnerSchemaRequired,
} from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";

import { Col, Row } from "reactstrap";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { AccordionElement } from "../../shared/Accordion";
import { Button } from "../../shared/Buttons";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
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
import { MultiFileUpload } from "../../shared/MultiFileUpload";

const PEP_VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  [BOOL_TRUE_KEY]: <FormattedMessage id="form.select.yes-they-are" />,
  [BOOL_FALSE_KEY]: <FormattedMessage id="form.select.no-they-are-not" />,
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

const KYCForm = injectIntlHelpers<FormikProps<IKycBeneficialOwner> & IProps>(
  ({ intl: { formatIntlMessage }, ...props }) => {
  return (
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
        label={formatIntlMessage("kyc.business.beneficial-owner.pep")}
        name="isPoliticallyExposed"
      />
      <Row>
        <Col xs={6} md={4}>
          <FormField label="Percent owned" name="ownership" suffix="%" />
        </Col>
      </Row>
      <div className="p-4 text-center">
        <Button type="submit" disabled={!props.isValid || props.loading}>
          <FormattedMessage id="form.button.submit-changes" />
        </Button>
      </div>
    </Form>
  );
});

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
    const { owner } = this.props;

    const name =
      owner && owner.firstName && owner.lastName
        ? `${owner.firstName} ${owner.lastName}`
        : `Beneficial Owner ${this.props.index + 1}`;

    return (
      <AccordionElement title={name} isOpened={true}>
        <KYCEnhancedForm {...this.props} />
        <MultiFileUpload
          layout="individual"
          onDropFile={this.props.onDropFile}
          files={this.props.files}
          fileUploading={this.props.fileUploading}
          filesLoading={this.props.filesLoading}
        />
        <div className="p-4 text-center">
          <Button layout="secondary" onClick={this.props.delete}>
            <FormattedMessage id="form.button.delete" /> {name}
          </Button>
        </div>
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
