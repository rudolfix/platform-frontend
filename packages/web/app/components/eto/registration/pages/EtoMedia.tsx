import { Button, EButtonLayout } from "@neufund/design-system";
import { EEtoFormTypes, EtoMediaType, TPartialCompanyEtoData } from "@neufund/shared-modules";
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
import { etoMediaProgressOptions } from "../../../../modules/eto-flow/utils";
import { appConnect } from "../../../../store";
import { FormField, FormFieldBoolean } from "../../../shared/forms";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { MediaLinksEditor } from "../../../shared/MediaLinksEditor";
import { SocialProfilesEditor, SOCIAL_PROFILES_ICONS } from "../../../shared/SocialProfilesEditor";
import { Tooltip } from "../../../shared/tooltips";
import { convert, removeEmptyKeyValueFields, removeIfUrlEmpty } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoRegistrationMediaComponent = ({ savingData, stateValues, saveData }: IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-media.title" />}
    progressOptions={etoMediaProgressOptions}
    validationSchema={EtoMediaType.toYup()}
    initialValues={stateValues}
    onSubmit={saveData}
  >
    <Section>
      <FormFieldLabel
        inheritFont={true}
        name="companyPitchdeckUrl.url"
        className="mb-1 mt-3 font-weight-bold text-uppercase"
      >
        <FormattedMessage id="eto.form.eto-media.pitch-deck" />
      </FormFieldLabel>
      <FormField placeholder="url" name="companyPitchdeckUrl.url" />

      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.youtube-video" />
      </div>
      <FormField placeholder="url" name="companyVideo.url" />

      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.slideshare" />
        <Tooltip content={<FormattedMessage id="eto.form.eto-media.slide-share.tooltip" />} />
      </div>
      <FormField placeholder="url" name="companySlideshare.url" />

      <div className="mb-2 mt-3 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels" />
      </div>
      <FormFieldBoolean
        name="disableTwitterFeed"
        label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
      />
      <SocialProfilesEditor
        profiles={SOCIAL_PROFILES_ICONS}
        name="socialChannels"
        className="mt-4"
      />

      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.media-links" />
      </div>
      <p className="mb-3">
        <FormattedMessage id="eto.form.eto-media.media-links-description" />
      </p>
      <MediaLinksEditor
        name="companyNews"
        placeholder="Media Link"
        blankField={{ publication: undefined, url: undefined, title: undefined }}
      />
      <div className=" mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.campaigning-links" />
      </div>
      <p className=" mb-3">
        <FormattedMessage id="eto.form.eto-media.campaigning-links-description" />
      </p>
      <MediaLinksEditor
        name="marketingLinks"
        placeholder="Document Link"
        blankField={{ url: undefined, title: undefined }}
      />
    </Section>
    <Section className={styles.buttonSection}>
      <Button
        layout={EButtonLayout.SECONDARY}
        type="submit"
        isLoading={savingData}
        data-test-id="eto-registration-media-submit"
      >
        <FormattedMessage id="form.button.save" />
      </Button>
    </Section>
  </EtoFormBase>
);

const EtoRegistrationMedia = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.EtoMedia),
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
)(EtoRegistrationMediaComponent);

//adhoc validation, no need to move it to utils
const addTitleIfUrlNotEmpty = (titleValue: string = "") => (data: {
  url?: string;
  title?: string;
}) => {
  if (data.url !== undefined && data.url !== "") {
    return { ...data, title: titleValue };
  } else {
    return undefined;
  }
};

const fromFormState = {
  companyPitchdeckUrl: addTitleIfUrlNotEmpty("Pitch Deck"),
  companyVideo: addTitleIfUrlNotEmpty(),
  companySlideshare: addTitleIfUrlNotEmpty(),
  socialChannels: removeIfUrlEmpty(),
  companyNews: removeEmptyKeyValueFields(),
  marketingLinks: removeEmptyKeyValueFields(),
};

export { EtoRegistrationMediaComponent, EtoRegistrationMedia };
