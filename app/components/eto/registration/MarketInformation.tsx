import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { Button } from "../../shared/Buttons";
import { FormField, FormTextArea } from "../../shared/forms/forms";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";

// @todo
type IEtoData = any;

interface IStateProps {
  currentValues: IEtoData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => (
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

const EtoEnhancedForm = withFormik<IProps, any>({
  // validationSchema: EtoDataSchema,
  // isInitialValid: (props: any) => EtoDataSchema.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationMarketInformationComponent: React.SFC<IProps> = props => (
  <Row>
    <Col xs={12} lg={{ size: 8, offset: 2 }}>
      <EtoRegistrationPanel
        steps={4}
        currentStep={2}
        title={"Market Information"}
        hasBackButton={false}
        isMaxWidth={true}
      >
        <EtoEnhancedForm {...props} />
      </EtoRegistrationPanel>
    </Col>
  </Row>
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
