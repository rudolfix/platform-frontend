import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  EtoRiskAssesmentType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
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

const distributionSuggestions = ["Development", "ESOP"];

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase title="Risk Assesment" validator={EtoRiskAssesmentType.toYup()}>
      <Section>
        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assesment.liquidity-description" />}
          placeholder="Describe"
          name="riskLiquidityDescription"
        />

        <div className="form-group">
          <FormCheckbox
            name="riskNoThirdPartyDependency"
            label={
              <FormattedMessage id="eto.form.risk-assesment.no-third-parties" />
            }
          />
        </div>

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assesment.third-parties-description" />}
          placeholder="Describe"
          name="riskThirdPartyDescription"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assesment.third-party-financing-description" />}
          placeholder="Describe"
          name="riskThirdPartySharesFinancing"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assesment.changing-agreement-description" />}
          placeholder="Describe"
          name="riskChangingAgreementDescription"
        />

        <FormTextArea
          className="my-2"
          label={<FormattedMessage id="eto.form.risk-assesment.max-risk-description" />}
          placeholder="Describe"
          name="riskMaxDescription"
        />

        <div className="form-group">
          <FormCheckbox
            name="riskNotRegulatedBusiness"
            label={ <FormattedMessage id="eto.form.risk-assesment.no-regulation" /> }
          />
        </div>

        <div className="form-group">
          <FormCheckbox
            name="riskNoLoansExist"
            label={ <FormattedMessage id="eto.form.risk-assesment.no-loans" /> }
          />
        </div>
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
  validationSchema: EtoRiskAssesmentType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationRiskAssesmentComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationRiskAssesment = compose<React.SFC>(
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
)(EtoRegistrationRiskAssesmentComponent);
