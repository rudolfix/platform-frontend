import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { EtoFormBase } from "../EtoFormBase";

import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { EtoMediaType, TPartialCompanyEtoData } from "../../../../lib/api/eto/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { FormCheckbox } from "../../../shared/forms/formField/FormCheckbox";
import { SOCIAL_PROFILES_ICONS, SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";

import { Button } from "../../../shared/Buttons";
import { MediaLinksEditor } from "../../../shared/MediaLinksEditor";
import { Section } from "../Shared";

import { etoMediaProgressOptions } from "../../../../modules/eto-flow/selectors";
import { FormField } from "../../../shared/forms/forms";

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
        <FormattedMessage id="eto.form.eto-media.youtube-video" />
      </p>
      <Row>
        <Col className="offset-1" xs={10}>
          <FormField name="companyVideo.url" placeholder="url" />
        </Col>
      </Row>

      <p className="offset-1 mb-2 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels" />
      </p>
      <Row>
        <Col className="offset-1 mt-3">
          <FormCheckbox
            name="disableTwitterFeed"
            label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
          />
        </Col>
      </Row>
      <Row>
        <Col className="offset-1" xs={10}>
          <SocialProfilesEditor
            profiles={SOCIAL_PROFILES_ICONS}
            name="socialChannels"
            className="mt-4"
          />
        </Col>
      </Row>

      <p className="offset-1 mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.media-links" />
      </p>
      <p className="offset-1 mb-3">
        <FormattedMessage id="eto.form.eto-media.media-links-description" />
      </p>
      <MediaLinksEditor
        name="companyNews"
        placeholder="Media Link"
        blankField={{ url: "", title: "" }}
      />
      <p className="offset-1 mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.campaigning-links" />
      </p>
      <p className="offset-1 mb-3">
        <FormattedMessage id="eto.form.eto-media.campaigning-links-description" />
      </p>
      <MediaLinksEditor
        name="marketingLinks"
        placeholder="Document Link"
        blankField={{ url: "", title: "" }}
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
          <FormattedMessage id="form.button.save" />
        </Button>
      </Row>
    </Col>
  </EtoFormBase>
);

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoMediaType.toYup(),
  mapPropsToValues: props => {
    const values = props.stateValues;
    // set initial values to prevent server errors on saving without filled out video
    values.companyVideo = {
      url: (values.companyVideo && values.companyVideo.url) || "",
      title: (values.companyVideo && values.companyVideo.title) || "",
    };
    return values;
  },
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
