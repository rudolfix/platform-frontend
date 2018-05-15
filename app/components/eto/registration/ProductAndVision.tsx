import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { FormTextArea } from "../../shared/forms/forms";
import { EtoRegistrationPanel } from "./EtoRegistrationPanel";

import { EtoDataSchema, IEtoData } from "../../../lib/api/EtoApi.interfaces";

interface IStateProps {
  currentValues: IEtoData;
  loadingData: boolean;
}

interface IDispatchProps {
  submitForm: (values: IEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

// Add translations to forms
const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => (
  <Form>
    <Row className="justify-content-center">
      <Col xs={12} lg={6}>
        <div className="mb-4">
          <FormTextArea label="What is the sales model?" name="salesModel" />
        </div>
        <div className="mb-4">
          <FormTextArea
            label="What is the exact target segment of your product?"
            name="targetSegment"
          />
        </div>
        <div className="mb-4">
          <FormTextArea label="what is the product vision?" name="productVision" />
        </div>
        <div className="mb-4">
          <FormTextArea
            label="What are the key product priorities (i.e. roadmap) for the next 12 months?"
            name="productPriorities"
          />
        </div>
        <div className="mb-4">
          <FormTextArea label="What has inspired you to start this company?" name="whyStarted" />
        </div>
        <div className="mb-4">
          <FormTextArea label="how will you use the raised capital?" name="capitalUse" />
        </div>
      </Col>
    </Row>
    <div className="p-4 text-center">
      <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
        <FormattedMessage id="components.eto.registration.product-and-vision.save-and-continue" />
      </Button>
    </div>
  </Form>
);

const EtoEnhancedForm = withFormik<IProps, IEtoData>({
  validationSchema: EtoDataSchema,
  isInitialValid: (props: any) => EtoDataSchema.isValidSync(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationProductAndVisionComponent: React.SFC<IProps & IIntlProps> = ({
  intl: { formatIntlMessage },
  ...props
}) => (
  <Row>
    <Col xs={12} lg={{ size: 8, offset: 2 }}>
      <EtoRegistrationPanel
        steps={4}
        currentStep={3}
        title={formatIntlMessage("components.eto.registration.product-and-vision.title")}
        hasBackButton={false}
        isMaxWidth={true}
      >
        <EtoEnhancedForm {...props} />
      </EtoRegistrationPanel>
    </Col>
  </Row>
);

export const EtoRegistrationProductAndVision = compose<React.SFC>(
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
  injectIntlHelpers,
)(EtoRegistrationProductAndVisionComponent);
