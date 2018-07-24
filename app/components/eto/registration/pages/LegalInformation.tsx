import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormattedMessage } from "react-intl-phraseapp";
import {
  EtoLegalInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormFieldDate } from "../../../shared/forms/formField/FormFieldDate";
import { FormSelectField } from "../../../shared/forms/formField/FormSelectField";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IRounds {
  [key: string]: TTranslatedString;
}

export const FUNDING_ROUNDS: IRounds = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  pre_seed: "pre seed",
  seed: "seed",
  a_round: "a round",
  b_round: "b round",
  c_round: "c round",
  d_round: "d round",
  e_round: "e round",
  pre_ipo: "pre ipo",
  public: "public",
};

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase title="Legal Information" validator={EtoLegalInformationType.toYup()}>
      <Section>
        <FormField label="Legal company name" name="name" disabled />
        <FormField label="Legal form" name="legalForm" disabled />
        <FormField label="Company Street Address" name="street" disabled />
        <FormField label="City / Country" name="country" disabled />
        <FormField label="Registration number*" name="registrationNumber" />
        <FormField label="Vat number*" name="vatNumber" />
        <FormFieldDate label="Company founding date*" name="foundingDate" />
        <FormSelectField
          label="Number of employees*"
          values={{
            NONE_KEY: <FormattedMessage id="form.select.please-select" />,
            "1-9": "1-9",
            "10-99": "10-99",
            "100-999": "100-999",
            ">1000": ">1000",
          }}
          name="numberOfEmployees"
        />
        <FormField label="Number of founders" type="number" name="numberOfFounders" />
        <FormSelectField label="Last Funding Round*" values={FUNDING_ROUNDS} name="companyStage" />
        <FormField label="Last Funding Amount" type="number" name="lastFundingSizeEur" />
        <FormField label="Number of existing shares" type="number" name="companyShares" />
        {/* TODO: Add pie chart */}
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

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoLegalInformationType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationLegalInformationComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationLegalInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationLegalInformationComponent);
