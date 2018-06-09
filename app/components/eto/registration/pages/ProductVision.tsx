import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoCompanyInformationType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (_props: FormikProps<TPartialEtoData>) => {
  return (
    <Form>
      <h4 className="text-center">Product Vision</h4>
      <Section>
        {/* TODO: Remove Title and add it to header component */}
        <FormTextArea
          className="my-2"
          label="WHAT IS THE PROBLEM YOU ARE SOLVING AND HOW?"
          placeholder="Describe"
          name="problemDescription"
        />

        <FormTextArea
          className="my-2"
          label="WHAT IS THE EXACT TARGET CUSTOMER GROUP OF YOUR PRODUCT?"
          placeholder="Describe"
          name="customerGroup"
        />

        <FormTextArea
          className="my-2"
          label="WHAT IS THE PRODUCT VISION?"
          placeholder="Describe"
          name="productVision"
        />

        <FormTextArea
          className="my-2"
          label="WHAT HAS INSPIRED YOU TO START THIS COMPANY?"
          placeholder="Describe"
          name="companyInspiration"
        />

        <FormTextArea
          className="my-2"
          label="WHAT ARE THE KEY PRODUCT PRIORITIES (I.E. ROADMAP) FOR THE NEXT 12 MOTNHS?"
          placeholder="Describe"
          name="productPriorities"
        />

        <FormCategoryDistribution
          label="HOW WILL YOU USE THE RAISED CAPITAL?"
          name="moe"
          className="my-3"
        />

        <FormTextArea
          className="my-2"
          label="WHAT IS THE SALES MODEL?"
          placeholder="Describe"
          name="salesModel"
        />

        <FormTextArea
          className="my-2"
          label="WHAT IS THE MARKETING APPRAOCH?"
          placeholder="Describe"
          name="marketingAppraoch"
        />

        <FormTextArea
          className="my-2"
          label="WHAT IS YOUR UNIQUE SELLING PROPOSITION?"
          placeholder="Describe"
          name="sellingProposition"
        />
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            onClick={() => {
              // tslint:disable-next-line
              console.log("Form values: ", _props.values);
              _props.submitForm();
            }}
          >
            Save
          </Button>
        </Row>
      </Col>
    </Form>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoCompanyInformationType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.stateValues),
  mapPropsToValues: props => props.stateValues,
  // enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationProductVisionComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationProductVision = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      stateValues: s.etoFlow.data,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (data: any) => {
        dispatch(actions.etoFlow.loadData(data));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationProductVisionComponent);
