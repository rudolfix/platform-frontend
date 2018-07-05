import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
import { Button } from "../../../shared/Buttons";

import * as facebookIcon from "../../../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../../../assets/img/inline_icons/social_telegram.svg";

const socialProfiles = [
  {
    name: "linkedin",
    placeholder: "linkedin.com",
    svgIcon: linkedinIcon,
  },
  {
    name: "facebook",
    placeholder: "facebook.com",
    svgIcon: facebookIcon,
  },
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "reddit",
    placeholder: "reddit.com",
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
  >
    <Section>
      <SocialProfilesEditor profiles={socialProfiles} name="socialChannels" />
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
