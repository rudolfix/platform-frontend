import * as React from "react";

import { Form, FormikProps, withFormik } from "formik";
import { compose } from "redux";

import { appConnect } from "../../../store";

import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import { FormField, FormTextArea } from "../../shared/forms/forms";

import { Col, Row } from "reactstrap";
import {
  EtoMarketInformationSchemaRequired,
  IEtoMarketInformation,
} from "../../../lib/api/EtoApi.interfaces";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { HorizontalLine } from "../../shared/HorizontalLine";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";

interface IStateProps {
  currentValues: IEtoMarketInformation;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoMarketInformation) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoMarketInformation> & IProps) => (
  <Form>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <div className="mb-4">
          <FormTextArea label="What is the sales model?" name="salesModel" />
        </div>
        <div className="mb-4">
          <FormTextArea label="What is the marketing approach?" name="marketingApproach" />
        </div>
        <div className="mb-4">
          <FormTextArea label="USP" name="usp" />
        </div>
        <div className="mb-4">
          <FormTextArea label="Who are your key competitors?" name="competitors" />
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Business partners</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surName" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add more
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>Key Customers</h4>
        <Accordion>
          <AccordionElement isOpened={true} title="First Name">
            <FormField label="First name" name="firstName" />
            <FormField label="Surname" name="surName" />
          </AccordionElement>
        </Accordion>
        <div className="p-4 text-center">
          <Button
            layout="secondary"
            iconPosition="icon-before"
            svgIcon={plusIcon}
            onClick={() => {}}
            disabled={true}
          >
            Add more
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        Submit and continue
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoMarketInformation>({
  validationSchema: EtoMarketInformationSchemaRequired,
  isInitialValid: (props: any) =>
    EtoMarketInformationSchemaRequired.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationMarketInformationComponent: React.SFC<IProps> = props => (
  <EtoRegistrationPanel
    steps={6}
    currentStep={4}
    title="Market Information"
    hasBackButton={false}
    isMaxWidth={true}
  >
    <EtoEnhancedForm {...props} />
  </EtoRegistrationPanel>
);

export const EtoRegistrationMarketInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: _state => ({
      loadingData: false,
      currentValues: {},
    }),
    dispatchToProps: _dispatch => ({
      submitForm: () => {},
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationMarketInformationComponent);
