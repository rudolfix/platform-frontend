import { FieldArray, FormikProps, withFormik } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FormField } from "../../../shared/forms/forms";
import { EtoFormBase } from "../EtoFormBase";

import { compose } from "redux";
import { EtoMediaType, TPartialCompanyEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
import { SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";
import { Section } from "../Shared";

import { Col, Row } from "reactstrap";
import { CommonHtmlProps } from "../../../../types";
import { Button, ButtonIcon } from "../../../shared/Buttons";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import * as facebookIcon from "../../../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../../../assets/img/inline_icons/social_telegram.svg";

const socialProfiles = [
  {
    name: "LinkedIn",
    url: "linkedin.com",
    svgIcon: linkedinIcon,
  },
  {
    name: "Facebook",
    url: "facebook.com",
    svgIcon: facebookIcon,
  },
  {
    name: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "Reddit",
    url: "reddit.com",
    svgIcon: redditIcon,
  },
  {
    name: "Telegram",
    svgIcon: telegramIcon,
  },
];

const distributionSuggestions = ["Media link", "Media link"];

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKeys: string[];
  onAddClick: () => void;
  onRemoveClick: () => void;
  placeholder: string;
  name: string;
}

interface IMediaLinkFieldsExternalProps {
  blankField: object;
  name: string;
  placeholder: string;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const {
    isFirstElement,
    onAddClick,
    onRemoveClick,
    isLastElement,
    placeholder,
    formFieldKeys,
  } = props;

  return (
    <Row className="my-4">
      <Col xs={1}>{isLastElement && <ButtonIcon svgIcon={plusIcon} onClick={onAddClick} />}</Col>
      <Col xs={10}>
        <FormField name={`${props.name}.${formFieldKeys[0]}`} placeholder={placeholder} />
      </Col>
      {!isFirstElement && (
        <Col xs={1}>
          <span className="pt-2">
            <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} />
          </span>
        </Col>
      )}
    </Row>
  );
};

class MediaLinkFields extends React.Component<IMediaLinkFieldsExternalProps & CommonHtmlProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  private blankField = { ...this.props.blankField };

  componentWillMount(): void {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { name } = this.props;

    if (!values[name]) {
      setFieldValue(`${name}.0`, this.blankField);
    }
  }

  render(): React.ReactNode {
    const { name, placeholder } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;

    const links = values[name] || [];
    const formFieldKeys = Object.keys(this.blankField);

    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            {links.map((_: { description: string; percent: number }, index: number) => {
              const isLastElement = !(index < links.length - 1);
              const isFirstElement = index === 0;

              return (
                <SingleMediaLinkField
                  placeholder={placeholder}
                  name={`${name}.${index}`}
                  formFieldKeys={formFieldKeys}
                  onRemoveClick={() => {
                    arrayHelpers.remove(index);
                  }}
                  onAddClick={() => {
                    setFieldValue(`${name}.${index + 1}`, this.blankField);
                  }}
                  isFirstElement={isFirstElement}
                  isLastElement={isLastElement}
                />
              );
            })}
          </>
        )}
      />
    );
  }
}

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-media.title" />}
    validator={EtoMediaType.toYup()}
  >
    <Section>
      <SocialProfilesEditor profiles={socialProfiles} />
      <MediaLinkFields
        className="mb-4"
        name="socialProfiles"
        blankField={{
          type: "",
          name: "",
        }}
        placeholder=""
      />
      <FormField
        label={<FormattedMessage id="eto.form.eto-media.bitcoin-talk-link" />}
        placeholder="Bitcoin talk link"
        name="bitcoinTalkLink"
      />
      <FormCheckbox
        name="enableTwitterFeed"
        label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
      />
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
          isLoading={false}
        >
          Save
        </Button>
      </Row>
    </Col>
  </EtoFormBase>
);

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoMediaType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationMediaComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationMedia = compose<React.SFC>(
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
)(EtoRegistrationMediaComponent);
