import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EtoFormBase } from "../EtoFormBase";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { EtoMediaType, TPartialCompanyEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
import { SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";

import { Button } from "../../../shared/Buttons";
import { MediaLinksEditor } from "../../../shared/MediaLinksEditor";
import { Section } from "../Shared";

import * as facebookIcon from "../../../../assets/img/inline_icons/social_facebook.svg";
import * as githubIcon from "../../../../assets/img/inline_icons/social_github.svg";
import * as googleIcon from "../../../../assets/img/inline_icons/social_google_plus.svg";
import * as instagramIcon from "../../../../assets/img/inline_icons/social_instagram.svg";
import * as linkedinIcon from "../../../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../../../assets/img/inline_icons/social_reddit.svg";
import * as slackIcon from "../../../../assets/img/inline_icons/social_slack.svg";
import * as telegramIcon from "../../../../assets/img/inline_icons/social_telegram.svg";
import * as socialTwitter from "../../../../assets/img/inline_icons/social_twitter.svg";
import { etoMediaProgressOptions } from "../../../../modules/eto-flow/selectors";
import { FormField } from "../../../shared/forms/forms";

const socialProfiles = [
  {
    name: "slack",
    placeholder: "slack",
    svgIcon: slackIcon,
  },
  {
    name: "twitter",
    placeholder: "twitter",
    svgIcon: socialTwitter,
  },
  {
    name: "gplus",
    placeholder: "google plus",
    svgIcon: googleIcon,
  },
  {
    name: "instagram",
    placeholder: "instagram",
    svgIcon: instagramIcon,
  },
  {
    name: "github",
    placeholder: "github",
    svgIcon: githubIcon,
  },
  {
    name: "linkedin",
    placeholder: "linkedin",
    svgIcon: linkedinIcon,
  },
  {
    name: "facebook",
    placeholder: "facebook",
    svgIcon: facebookIcon,
  },
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "reddit",
    placeholder: "reddit",
    svgIcon: redditIcon,
  },
  {
    name: "telegram",
    placeholder: "Telegram",
    svgIcon: telegramIcon,
  },
];

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
    title={<FormattedMessage id="eto.form.eto-media.title" />}
    validator={EtoMediaType.toYup()}
    progressOptions={etoMediaProgressOptions}
  >
    <Section>
      <p className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels" />
      </p>
      <Col className="offset-1">
        <FormField
          name="companyVideo.url"
          placeholder="Media Link"
          label={<FormattedMessage id="eto.form.eto-media.you-tube-video" />}
          additionalObjValue={{ name: "companyVideo.title", value: "youtube" }}
        />
      </Col>
      <SocialProfilesEditor profiles={socialProfiles} name="socialChannels" className="mt-4" />
      <p className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels-others" />
      </p>
      <MediaLinksEditor
        name="companyNews"
        placeholder="Media Link"
        blankField={{ url: "", title: "media link" }}
      />
      <Row>
        <Col className="offset-1">
          <FormCheckbox
            name="disableTwitterFeed"
            label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
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
