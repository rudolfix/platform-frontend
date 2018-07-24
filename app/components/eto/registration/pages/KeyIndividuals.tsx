import { FieldArray, FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { compose } from "redux";

import {
  EtoKeyIndividualsType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";

import { Col, Row } from "reactstrap";
import { TTranslatedString } from "../../../../types";
import { Button, ButtonIcon } from "../../../shared/Buttons";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormField, FormTextArea } from "../../../shared/forms/forms";
import { FormSection } from "../../../shared/forms/FormSection";
import { EtoFormBase } from "../EtoFormBase";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./KeyIndividuals.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

interface IIndividual {
  onRemoveClick: () => void;
  onAddClick: () => void;
  isLast: boolean;
  isFirst: boolean;
  index: number;
  groupFieldName: string;
}

interface IKeyIndividualsGroup {
  name: string;
  title: TTranslatedString;
}

const blankMember = {
  name: "",
  role: "",
  description: "",
  image: "",
};

const Individual: React.SFC<IIndividual> = props => {
  const { onAddClick, onRemoveClick, isLast, isFirst, index, groupFieldName } = props;

  return (
    <>
      <FormHighlightGroup>
        {!isFirst && (
          <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} className={styles.removeButton} />
        )}
        <FormField
          name={`${groupFieldName}.members.${index}.name`}
          label={<FormattedMessage id="eto.form.key-individuals.name" />}
          placeholder="name"
        />
        <FormField
          name={`${groupFieldName}.members.${index}.role`}
          label={<FormattedMessage id="eto.form.key-individuals.role" />}
          placeholder="role"
        />
        <FormTextArea
          name={`${groupFieldName}.members.${index}.description`}
          label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
          placeholder=" "
        />
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.key-individuals.image" />}
          name={`${groupFieldName}.members.${index}.image`}
          acceptedFiles="image/*"
          fileFormatInformation="*150 x 150px png"
        />
      </FormHighlightGroup>
      {isLast && (
        <Button
          iconPosition="icon-before"
          layout="secondary"
          svgIcon={plusIcon}
          onClick={onAddClick}
        >
          <FormattedMessage id="eto.form.key-individuals.add" />
        </Button>
      )}
    </>
  );
};

class KeyIndividualsGroup extends React.Component<IKeyIndividualsGroup> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  componentWillMount(): void {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { name } = this.props;

    if (!values[name]) {
      setFieldValue(`${name}.members.0`, blankMember);
    }
  }

  render(): React.ReactNode {
    const { title, name } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const individuals = values[name] && values[name].members ? values[name].members : [blankMember];

    return (
      <FormSection title={title}>
        <FieldArray
          name={name}
          render={arrayHelpers =>
            individuals.map((_: {}, index: number) => {
              return (
                <Individual
                  key={index}
                  onRemoveClick={() => {
                    arrayHelpers.remove(index); // TODO this does not work right...
                  }}
                  onAddClick={() => {
                    setFieldValue(`${name}.members.${index + 1}`, blankMember);
                  }}
                  index={index}
                  isFirst={!index}
                  isLast={index === individuals.length - 1}
                  groupFieldName={name}
                />
              );
            })
          }
        />
      </FormSection>
    );
  }
}

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.key-individuals.title" />}
      validator={EtoKeyIndividualsType.toYup()}
    >
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}
        name="founders"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.board-members.title" />}
        name="boardMembers"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.notable-investors.title" />}
        name="notableInvestors"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-customers.title" />}
        name="keyCustomers"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.partners.title" />}
        name="partners"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
        name="keyAlliances"
      />
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
