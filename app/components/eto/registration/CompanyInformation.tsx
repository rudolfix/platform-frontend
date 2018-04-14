import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import { FormField } from "../../shared/forms/forms";

import { Col, Row } from "reactstrap";
import {
  EtoCompanyInformationSchemaRequired,
  IEtoCompanyInformation,
} from "../../../lib/api/EtoApi.interfaces";
import { FormFieldDate } from "../../shared/forms/formField/FormFieldDate";
import { FormTextArea } from "../../shared/forms/formField/FormTextArea";
import { MultiFileUpload } from "../../shared/MultiFileUpload";
import { SingleFileUpload } from "../../shared/SingleFileUpload";

interface IStateProps {
  currentValues: IEtoCompanyInformation;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoCompanyInformation) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoCompanyInformation> & IProps) => (
  <Form>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <FormField label="Company Name" name="name" className="mt-2" />
        <FormField label="Company Website" name="website" className="mt-2" />
        <SingleFileUpload
          className="my-5"
          onDropFile={() => {}}
          files={[]}
          fileUploading={false}
          filesLoading={false}
          uploadCta="Upload company logo"
          fileFormatInformation=".svg, .png"
        />
        <FormField label="Company Address" name="address" />
        <Row className="mt-2">
          <Col xs={12} lg={6}>
            <FormField label="City" name="city" />
          </Col>
          <Col xs={12} lg={6}>
            <FormField label="Zip Code" name="zipCode" />
          </Col>
        </Row>
        <FormField label="Country" name="country" />
        <FormFieldDate label="Founding date" name="foundingDate" />
        <FormField label="Registration number" name="registrationNumber" />
        <FormField label="VAT number" placeholder="EU Only" name="vatNumber" />
        <FormField label="Legal form" name="legalForm" />
        <MultiFileUpload
          className="my-5"
          layout="business"
          onDropFile={() => {}}
          files={[]}
          fileUploading={false}
          filesLoading={false}
        />
        <FormTextArea label="Company description" name="companyDescription" />
      </Col>
      <Col xs={12} className="d-flex justify-content-center">
        <Button
          className="mt-3"
          type="submit"
          disabled={!formikBag.isValid || formikBag.loadingData}
        >
          Submit and continue
        </Button>
      </Col>
    </Row>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoCompanyInformation>({
  validationSchema: EtoCompanyInformationSchemaRequired,
  isInitialValid: (props: any) =>
    EtoCompanyInformationSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationCompanyInformationComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={1}
    title="Company Information"
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({
      loadingData: false,
      currentValues: {},
    }),
    dispatchToProps: _dispatch => ({
      submitForm: (_values: IEtoCompanyInformation) => {},
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationCompanyInformationComponent);
