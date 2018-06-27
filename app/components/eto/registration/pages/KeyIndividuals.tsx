import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import {
  EtoKeyIndividualsType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";

import { Col, Row } from "reactstrap";
import { Button } from "../../../shared/Buttons";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { FormSection } from "../../../shared/forms/FormSection";
import { EtoFormBase } from "../EtoFormBase";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.key-individuals.title" />}
    validator={EtoKeyIndividualsType.toYup()}
  >
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

    <FormSection title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}>
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

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoKeyIndividualsType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationKeyIndividualsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationKeyIndividuals = compose<React.SFC>(
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
)(EtoRegistrationKeyIndividualsComponent);
