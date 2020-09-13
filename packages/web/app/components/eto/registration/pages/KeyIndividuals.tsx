import {
  Button,
  EButtonLayout,
  EIconPosition,
  getSchemaField,
  getValidationSchema,
  isRequired,
} from "@neufund/design-system";
import {
  EEtoFormTypes,
  EtoKeyIndividualsType,
  TEtoKeyIndividualType,
  TPartialCompanyEtoData,
} from "@neufund/shared-modules";
import { EMimeType } from "@neufund/shared-utils";
import cn from "classnames";
import { connect, FieldArray } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import {
  selectIssuerCompany,
  selectIssuerEtoLoading,
  selectIssuerEtoSaving,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TFormikConnect, TTranslatedString } from "../../../../types";
import { FormField, FormTextArea } from "../../../shared/forms";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { SocialProfilesEditor, SOCIAL_PROFILES_PERSON } from "../../../shared/SocialProfilesEditor";
import { convert, generateKeys, removeKeys, setDefaultValueIfUndefined } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import downIcon from "../../../../assets/img/inline_icons/down.svg";
import closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import upIcon from "../../../../assets/img/inline_icons/up.svg";
import * as styles from "../Shared.module.scss";
import * as localStyles from "./KeyIndividuals.module.scss";

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
  canRemove: boolean;
  index: number;
  groupFieldName: string;
  swap: (index1: number, index2: number) => void;
  length: number;
}

interface IKeyIndividualsGroup {
  name: string;
  title: TTranslatedString;
}

interface IMemberData {
  name: string | undefined;
  role: string | undefined;
  description: string | undefined;
  image: string | undefined;
  key: string;
}

const getBlankMember = () => ({
  name: undefined,
  role: undefined,
  description: undefined,
  image: undefined,
  key: Math.random().toString(),
});

const Individual: React.FunctionComponent<IIndividual> = ({
  onRemoveClick,
  canRemove,
  index,
  groupFieldName,
  swap,
  length,
}) => {
  const member = `${groupFieldName}.members.${index}`;
  return (
    <div className={localStyles.wrapper}>
      <FormHighlightGroup>
        {canRemove && (
          <Button
            layout={EButtonLayout.LINK}
            iconProps={{
              alt: <FormattedMessage id="common.remove" />,
            }}
            svgIcon={closeIcon}
            onClick={onRemoveClick}
            className={localStyles.removeButton}
          />
        )}
        <FormField
          name={`${member}.name`}
          label={<FormattedMessage id="eto.form.key-individuals.name" />}
          placeholder="Full Name"
        />
        <FormField
          name={`${member}.role`}
          label={<FormattedMessage id="eto.form.key-individuals.role" />}
        />
        <FormTextArea
          name={`${member}.description`}
          label={<FormattedMessage id="eto.form.key-individuals.short-bio" />}
          placeholder=" "
          charactersLimit={1200}
        />
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.key-individuals.image" />}
          name={`${member}.image`}
          acceptedFiles={[EMimeType.PNG, EMimeType.JPEG]}
          fileFormatInformation="*150 x 150px png"
          uploadRequirements={{ dimensions: "150x150", size: "4MB" }}
          dimensions={{ width: 150, height: 150 }}
          exactDimensions={true}
          data-test-id={`${member}.image`}
        />
        <FormField className="mt-4" name={`${member}.website`} placeholder="website" />
        <fieldset>
          <legend className={cn(localStyles.individualSocialChannelsLegend, "mt-4 mb-2")}>
            <FormattedMessage id="eto.form.key-individuals.add-social-channels" />
          </legend>
          <SocialProfilesEditor
            profiles={SOCIAL_PROFILES_PERSON}
            name={`${member}.socialChannels`}
          />
        </fieldset>
      </FormHighlightGroup>
      <div>
        <Button
          layout={EButtonLayout.LINK}
          iconProps={{
            alt: <FormattedMessage id="button-icon.up" />,
          }}
          onClick={() => swap(index, index - 1)}
          disabled={index === 0}
          svgIcon={upIcon}
        />
        <Button
          layout={EButtonLayout.LINK}
          onClick={() => swap(index, index + 1)}
          disabled={index === length - 1}
          svgIcon={downIcon}
          iconProps={{
            alt: <FormattedMessage id="button-icon.down" />,
          }}
        />
      </div>
    </div>
  );
};

class KeyIndividualsGroupLayout extends React.Component<IKeyIndividualsGroup & TFormikConnect> {
  isEmpty(): boolean {
    const { name, formik } = this.props;
    const { values } = formik;

    const individuals = values[name];

    return !individuals || (individuals.members && individuals.members.length === 0);
  }

  isRequired(): boolean {
    const { formik, name } = this.props;
    const { validationSchema } = formik;

    const fieldSchema = getSchemaField(name, getValidationSchema(validationSchema));

    return fieldSchema ? isRequired(fieldSchema) : false;
  }

  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;

    if (this.isRequired() && this.isEmpty()) {
      setFieldValue(`${name}.members.0`, getBlankMember());
    }
  }

  render(): React.ReactNode {
    const { title, name, formik } = this.props;
    const { values } = formik;

    const individuals = this.isEmpty() ? [] : values[name].members;
    return (
      <FormSection title={title}>
        <FieldArray name={`${name}.members`}>
          {arrayHelpers => (
            <>
              {individuals.map((member: IMemberData, index: number) => {
                const canRemove = !(index === 0 && this.isRequired());

                return (
                  <Individual
                    key={member.key}
                    onRemoveClick={() => arrayHelpers.remove(index)}
                    index={index}
                    canRemove={canRemove}
                    groupFieldName={name}
                    swap={arrayHelpers.swap}
                    length={individuals.length}
                  />
                );
              })}
              <Button
                data-test-id={`key-individuals-group-button-${name}`}
                iconPosition={EIconPosition.ICON_BEFORE}
                layout={EButtonLayout.LINK}
                svgIcon={plusIcon}
                onClick={() => arrayHelpers.push(getBlankMember())}
              >
                <FormattedMessage id="eto.form.key-individuals.add" />
              </Button>
            </>
          )}
        </FieldArray>
      </FormSection>
    );
  }
}

const KeyIndividualsGroup = connect<IKeyIndividualsGroup, TEtoKeyIndividualType>(
  KeyIndividualsGroupLayout,
);

const EtoRegistrationKeyIndividualsComponent = (props: IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.key-individuals.title" />}
    validationSchema={EtoKeyIndividualsType.toYup()}
    initialValues={convert(toFormState)(props.stateValues)}
    onSubmit={props.saveData}
  >
    <Section className={localStyles.sectionWrapper}>
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.team.title" />}
        name="team"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.advisors.title" />}
        name="advisors"
      />
      <KeyIndividualsGroup
        title={<FormattedMessage id="eto.form.key-individuals.section.key-alliances.title" />}
        name="keyAlliances"
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
    </Section>
    <Section className={styles.buttonSection}>
      <Button
        layout={EButtonLayout.SECONDARY}
        type="submit"
        isLoading={props.savingData}
        data-test-id="eto-registration-key-individuals-submit"
      >
        <FormattedMessage id="form.button.save" />
      </Button>
    </Section>
  </EtoFormBase>
);

const EtoRegistrationKeyIndividuals = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.KeyIndividuals),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: selectIssuerEtoLoading(s),
      savingData: selectIssuerEtoSaving(s),
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (company: TPartialCompanyEtoData) => {
        const convertedCompany = convert(fromFormState)(company);
        dispatch(actions.etoFlow.saveCompanyStart(convertedCompany));
      },
    }),
  }),
)(EtoRegistrationKeyIndividualsComponent);

export { EtoRegistrationKeyIndividualsComponent, EtoRegistrationKeyIndividuals };

const toFormState = {
  "team.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "advisors.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "keyAlliances.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "boardMembers.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "notableInvestors.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "keyCustomers.members": [setDefaultValueIfUndefined([]), generateKeys()],
  "partners.members": [setDefaultValueIfUndefined([]), generateKeys()],
};

const fromFormState = {
  "team.members": [removeKeys()],
  "advisors.members": [removeKeys()],
  "keyAlliances.members": [removeKeys()],
  "boardMembers.members": [removeKeys()],
  "notableInvestors.members": [removeKeys()],
  "keyCustomers.members": [removeKeys()],
  "partners.members": [removeKeys()],
};
