import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/Buttons";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { FormField } from "../../../shared/forms/index";
import { EtoTagWidget, generateTagOptions } from "../../shared/EtoTagWidget";
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

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

type IProps = IStateProps & IDispatchProps;

const EtoRegistrationTeamAndInvestorsComponent = (
  props: FormikProps<TPartialCompanyEtoData> & IProps,
) => (
  <EtoFormBase title="Company Information" validator={EtoCompanyInformationType.toYup()}>
    <Section>
      <FormField
        label={<FormattedMessage id="eto.form.company-information.brand-name" />}
        name="brandName"
      />
      <FormField
        label={<FormattedMessage id="eto.form.company-information.website" />}
        name="companyWebsite"
      />
      <FormField
        label={<FormattedMessage id="eto.form.company-information.company-tagline" />}
        name="companyOneliner"
      />

      <FormTextArea
        className="mb-2 mt-2"
        label={<FormattedMessage id="eto.form.company-information.company-description" />}
        placeholder="Describe your company 250 Characters"
        name="companyDescription"
        charactersLimit={750}
      />
      <FormTextArea
        label={<FormattedMessage id="eto.form.company-information.founders-quote" />}
        placeholder="Key Quote from Founder"
        name="keyQuoteFounder"
        charactersLimit={250}
      />
      <FormTextArea
        label={<FormattedMessage id="eto.form.company-information.investor-quote" />}
        placeholder="Key Quote from Investor"
        name="keyQuoteInvestor"
        charactersLimit={250}
      />

      <EtoTagWidget
        selectedTagsLimit={5}
        options={generateTagOptions(tagList)}
        name="categories"
        className="mb-4"
      />
      <Row>
        <Col>
          <FormSingleFileUpload
            name="companyLogo"
            label={<FormattedMessage id="eto.form.company-information.logo" />}
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150 png"
            className="mb-3"
          />
        </Col>
        <Col>
          <FormSingleFileUpload
            name="companyBanner"
            label={<FormattedMessage id="eto.form.company-information.banner" />}
            acceptedFiles="image/*"
            fileFormatInformation="*1250 x 400 png"
            className="mb-3"
          />
        </Col>
      </Row>
    </Section>
    <Col>
      <Row className="justify-content-end">
        <Button
          layout="primary"
          className="mr-4"
          type="submit"
          onClick={() => {
            // we need to submit data like this only b/c formik doesnt support calling props.submitForm with invalid form state
            props.saveData(props.values);
          }}
          isLoading={props.savingData}
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Row>
    </Col>
  </EtoFormBase>
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
  setDisplayName("EtoRegistrationCompanyInformation"),
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
  withFormik<IProps, TPartialCompanyEtoData>({
    validationSchema: EtoCompanyInformationType.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationTeamAndInvestorsComponent);
