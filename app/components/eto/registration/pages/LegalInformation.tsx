import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { HorizontalLine } from "../../../shared/HorizontalLine";

import * as plusIcon from "../../../../assets/img/inline_icons/plus.svg";

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
        <h4>
          <FormattedMessage id="components.eto.registration.market-information.business-partners" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.market-information.add-more" />
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <h4>
          <FormattedMessage id="components.eto.registration.market-information.key-customers" />
        </h4>
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
            <FormattedMessage id="components.eto.registration.market-information.add-more" />
          </Button>
        </div>
      </Col>
    </Row>
    <HorizontalLine className="mb-4" />
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        <FormattedMessage id="components.eto.registration.market-information.submit-and-continue" />
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
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationLegalInformation = compose<React.SFC>(
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
