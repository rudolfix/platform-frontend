import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  EtoProductVisionType,
  TPartialEtoData,
} from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const distributionSuggestions = ["Development", "ESOP"];

const EtoForm = (props: FormikProps<TPartialEtoData> & IProps) => {
  return (
    <EtoFormBase title="Product Vision" validator={EtoProductVisionType.toYup()}>
      <Section>
        {/* TODO: Remove Title and add it to header component */}
        <FormTextArea
          className="my-2"
          label="WHAT IS THE PROBLEM YOU ARE SOLVING AND HOW?"
          placeholder="Describe"
          name="problemSolved "
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
          name="inspiration"
        />

        <FormTextArea
          className="my-2"
          label="WHAT ARE THE KEY PRODUCT PRIORITIES (I.E. ROADMAP) FOR THE NEXT 12 MOTNHS?"
          placeholder="Describe"
          name="keyProductPriorities"
        />

        <FormCategoryDistribution
          label="HOW WILL YOU USE THE RAISED CAPITAL?"
          name="useOfCapitalList"
          paragraphName="useOfCapital"
          className="my-3"
          suggestions={distributionSuggestions}
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
          name="marketingApproach"
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
              props.saveData(props.values);
            }}
            isLoading={props.savingData}
          >
            Save
          </Button>
        </Row>
      </Col>
    </EtoFormBase>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoCompanyInformationType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationProductVisionComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationProductVision = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.data,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: any) => {
        dispatch(actions.etoFlow.saveDataStart(data));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationProductVisionComponent);
