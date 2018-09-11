import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoLegalInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { Button } from "../../../shared/Buttons";
import { FormCategoryDistribution } from "../../../shared/forms/formField/FormCategoryDistribution";
import { FormFieldDate } from "../../../shared/forms/formField/FormFieldDate";
import { FormSelectField } from "../../../shared/forms/formField/FormSelectField";
import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  company: TPartialCompanyEtoData;
}

interface IExternalProps {
  readonly: boolean;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

interface IRounds {
  [key: string]: TTranslatedString;
}

export const FUNDING_ROUNDS: IRounds = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  pre_seed: "Pre Seed",
  seed: "Seed",
  a_round: "A Round",
  b_round: "B Round",
  c_round: "C Round",
  d_round: "D Round",
  e_round: "E Round",
  pre_ipo: "Pre Ipo",
  public: "Public",
};

const NUMBER_OF_EMPLOYEES = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  "1-9": "1-9",
  "10-99": "10-99",
  "100-999": "100-999",
  ">1000": ">1000",
};

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<TPartialCompanyEtoData>;

const EtoRegistrationLegalInformationComponent = ({
  readonly,
  savingData,
  saveData,
  values,
}: IProps) => {
  return (
    <EtoFormBase title="Legal Information" validator={EtoLegalInformationType.toYup()}>
      <Section>
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-company-name" />}
          name="name"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.legal-form" />}
          name="legalForm"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.company-state-address" />}
          name="street"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.city-country" />}
          name="country"
          disabled
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.registration-number" />}
          name="registrationNumber"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.vat-number" />}
          name="vatNumber"
          disabled={readonly}
        />
        <FormFieldDate
          label={<FormattedMessage id="eto.form.legal-information.company-founding-date" />}
          name="foundingDate"
          disabled={readonly}
        />
        <FormSelectField
          label={<FormattedMessage id="eto.form.legal-information.number-of-employees" />}
          values={NUMBER_OF_EMPLOYEES}
          name="numberOfEmployees"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.number-of-founders" />}
          type="number"
          name="numberOfFounders"
          disabled={readonly}
        />
        <FormSelectField
          label={<FormattedMessage id="eto.form.legal-information.last-founding-round" />}
          values={FUNDING_ROUNDS}
          name="companyStage"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.last-founding-amount" />}
          type="number"
          name="lastFundingSizeEur"
          disabled={readonly}
        />
        <FormField
          label={<FormattedMessage id="eto.form.legal-information.number-of-existing-shares" />}
          type="number"
          min="0"
          name="companyShares"
          disabled={readonly}
        />
        <FormCategoryDistribution
          name="shareholders"
          prefix="%"
          label={<FormattedMessage id="eto.form.legal-information.shareholder-structure" />}
          suggestions={["Full Name"]}
          blankField={{ fullName: "", shares: "" }}
          disabled={readonly}
        />
      </Section>
      {!readonly && (
        <Col>
          <Row className="justify-content-end">
            <Button
              type="submit"
              layout="primary"
              className="mr-4"
              isLoading={savingData}
              onClick={() => {
                // we need to submit data like this only b/c formik doesnt support calling props.submitForm with invalid form state
                saveData(values);
              }}
            >
              <FormattedMessage id="form.button.save" />
            </Button>
          </Row>
        </Col>
      )}
    </EtoFormBase>
  );
};

export const EtoRegistrationLegalInformation = compose<React.SFC<IExternalProps>>(
  setDisplayName("EtoRegistrationLegalInformation"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      loadingData: state.etoFlow.loading,
      savingData: state.etoFlow.saving,
      company: state.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, TPartialCompanyEtoData>({
    validationSchema: EtoLegalInformationType.toYup(),
    mapPropsToValues: props => props.company,
    handleSubmit: (values, { props }) => props.saveData(values),
  }),
)(EtoRegistrationLegalInformationComponent);
