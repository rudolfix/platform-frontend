import { FieldArray, Form, FormikProps, withFormik, Formik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoTeamDataType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { FormField, InlineFormField } from "../../../shared/forms/forms";
import { SingleFileUpload } from "../../../shared/SingleFileUpload";
import { Section } from "../Shared";

import * as plusIcon from "../../../../assets/img/inline_icons/plus.svg";
import { TagsEditorWidget } from "../../shared/TagsEditor";
import { EtoTagWidget, generateTagOptions } from "../../shared/EtoTagWidget";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (_props: FormikProps<TPartialEtoData>) => {
  // We are hitting tslint bug: https://github.com/palantir/tslint/issues/3540
  /* tslint:disable:no-useless-cast restrict-plus-operands */
  return (
    <Formik
      initialValues={{ tags: [] }}
      onSubmit={() => {
        debugger;
      }}
    >
      <Form>
        <h4 className="text-center">Company Information</h4>
        <Section>
          {/* TODO: Remove Title and add it to header component */}
          <FormField placeholder="Brand Name*" name="brandName" />
          <FormField placeholder="Website*" name="website" />
          <FormField placeholder="Company tagline*" name="companyTagline" />
          <FormTextArea
            placeholder="Describe your company* 250 Characters"
            name="companyDescription"
          />
          <FormTextArea placeholder="Key Quote from Founder 250 Characters" name="founderQuote" />
          <FormTextArea placeholder="Key Quote from Investor 250 Characters" name="investorQuote" />
          <EtoTagWidget
            name="tags"
            selectedTagsLimit={5}
            options={generateTagOptions(["science"])}
          />
          {/* TODO: Add upload single file component */}
        </Section>
      </Form>
    </Formik>
  );
  /* tslint:enable */
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoTeamDataType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.stateValues),
  mapPropsToValues: props => props.stateValues,
  // enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
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
)(EtoRegistrationTeamAndInvestorsComponent);
