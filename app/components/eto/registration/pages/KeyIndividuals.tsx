import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";

import { Button } from "../../../shared/Buttons";
import { EtoFormWrapper } from "../../../shared/forms/EtoFormWrapper";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { FormSection } from "../../../shared/forms/FormSection";

type IEtoData = any;
interface IStateProps {
  loadingData: boolean;
  currentValues: IEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (formikBag: FormikProps<IEtoData> & IProps) => {
  return (
    <Form>
      <FormSection title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}>
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <FormSection
        title={<FormattedMessage id="eto.form.key-individuals.section.board-members.title" />}
      >
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <FormSection
        title={<FormattedMessage id="eto.form.key-individuals.section.notable-investors.title" />}
      >
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <FormSection
        title={<FormattedMessage id="eto.form.key-individuals.section.key-customers.title" />}
      >
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <FormSection
        title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}
      >
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <FormSection
        title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
      >
        <FormHighlightGroup>
          <FormField
            name="teamMemberName"
            label={<FormattedMessage id="eto.form.key-individuals.name" />}
            placeholder="name"
          />
          <FormField
            name="teamMemberRole"
            label={<FormattedMessage id="eto.form.key-individuals.role" />}
            placeholder="role"
          />
          <FormTextArea
            name="teamMemberShortBio"
            label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
            placeholder="role"
          />
          <FormSingleFileUpload
            label={<FormattedMessage id="eto.form.key-individuals.image" />}
            name="teamMemberImage"
            acceptedFiles="image/*"
            fileFormatInformation="*150 x 150px png"
          />
        </FormHighlightGroup>
      </FormSection>

      <div className="text-right">
        <Button type="submit" disabled={!formikBag.isValid || formikBag.loadingData}>
          <FormattedMessage id="eto.form.save" />
        </Button>
      </div>
    </Form>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  // validationSchema: EtoCompanyInformationType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.currentValues),
  mapPropsToValues: props => props.currentValues,
  enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoFormWrapper
    title={<FormattedMessage id="eto.form.key-individuals.title" />}
    progressPercent={60}
  >
    <EtoEnhancedForm {...props} />
  </EtoFormWrapper>
);

export const EtoRegistrationKeyIndividuals = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      currentValues: s.etoFlow.data,
    }),
    dispatchToProps: _dispatch => ({
      submitForm: () => {},
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationTeamAndInvestorsComponent);
