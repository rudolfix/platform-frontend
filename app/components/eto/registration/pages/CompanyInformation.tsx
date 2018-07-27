import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button } from "../../../shared/Buttons";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { FormField } from "../../../shared/forms/forms";
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

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase title="Company Information" validator={EtoCompanyInformationType.toYup()}>
      <Section>
        <FormField label="Brand Name*" name="brandName" />
        <FormField label="Website*" name="companyWebsite" />
        <FormField label="Company tagline*" name="companyOneliner" />

        <FormTextArea
          className="mb-2 mt-2"
          label="Company Description*"
          placeholder="Describe your company 250 Characters"
          name="companyDescription"
        />
        <FormTextArea
          label="Founders Quote"
          placeholder="Key Quote from Founder 250 Characters"
          name="keyQuoteFounder"
        />
        <FormTextArea
          label="Founders Investor"
          placeholder="Key Quote from Investor 250 Characters"
          name="keyQuoteInvestor"
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
              label="Logo"
              acceptedFiles="image/*"
              fileFormatInformation="*150 x 150 png"
              className="mb-3"
            />
          </Col>
          <Col>
            <FormSingleFileUpload
              name="companyBanner"
              label="Banner"
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

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
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
)(EtoRegistrationTeamAndInvestorsComponent);
