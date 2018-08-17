import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  EtoProductVisionType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const distributionSuggestions = ["Development", "Other"];

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase title="Product Vision" validator={EtoProductVisionType.toYup()}>
      <Section>
        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.inspiration" />}
          placeholder="Describe"
          name="inspiration"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.product-vision" />}
          placeholder="Describe"
          name="productVision"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
          placeholder="Describe"
          name="problemSolved"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.customer-group" />}
          placeholder="Describe"
          name="customerGroup"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.sales-model" />}
          placeholder="Describe"
          name="salesModel"
        />

        <FormCategoryDistribution
          label={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
          name="useOfCapitalList"
          paragraphName="useOfCapital"
          suggestions={distributionSuggestions}
          prefix="%"
          transformRatio={100}
          blankField={{
            description: "",
            percent: 0,
          }}
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
          placeholder="Describe"
          name="marketingApproach"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
          placeholder="Describe"
          name="sellingProposition"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.product-vision.key-product-priorities" />}
          placeholder="Describe"
          name="keyProductPriorities"
          charactersLimit={250}
        />
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            type="submit"
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

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
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
      stateValues: s.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: data,
            etoData: {},
          }),
        );
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationProductVisionComponent);
