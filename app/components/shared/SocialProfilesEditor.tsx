import * as cn from "classnames";
import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps } from "../../types";
import { FormField } from "./forms/formField/FormField";
import { InlineIcon } from "./InlineIcon";

import * as styles from "./SocialProfilesEditor.module.scss";
import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as githubIcon from "../../assets/img/inline_icons/social_github.svg";
import * as googleIcon from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagramIcon from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as slackIcon from "../../assets/img/inline_icons/social_slack.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import * as socialTwitter from "../../assets/img/inline_icons/social_twitter.svg";

export const SOCIAL_PROFILES_ICONS = [
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

export const SOCIAL_PROFILES_PERSON = [
  {
    name: "medium",
    placeholder: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "twitter",
    placeholder: "twitter",
    svgIcon: socialTwitter,
  },
  {
    name: "linkedin",
    placeholder: "linkedin",
    svgIcon: linkedinIcon,
  },
]

const SocialMediaTags: React.SFC<{
  profiles: ISocialProfile[];
  className?: string;
  onClick: (index: number) => void;
  selectedFields: boolean[];
}> = props => {
  const { profiles, className, onClick, selectedFields } = props;
  return (
    <div className={cn(styles.socialProfilesEditor, className)}>
      <div className={styles.tabs}>
        {profiles.map(({ name, svgIcon }, index) => (
          <div
            onClick={() => onClick(index)}
            className={cn(Boolean(selectedFields[index]) && "is-selected", styles.tab)}
            key={name}
          >
            <InlineIcon svgIcon={svgIcon} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ISingleMediaLinkFieldInternalProps {
  name: string;
  profile: ISocialProfile;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const { profile, name } = props;

  return (
    <Row className="my-4 justify-content-center">
      <Col xs={10}>
        <FormField name={`${name}.url`} placeholder={profile.placeholder} />
      </Col>
    </Row>
  );
};

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  placeholder?: string;
  url?: string;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
  name: string;
}

interface IState {
  selectedFields: boolean[];
  filteredFields: boolean[];
}

export class SocialProfilesEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { selectedFields: [], filteredFields: [] };
  }

  static contextTypes = {
    formik: PropTypes.object,
  };

  componentDidMount(): void {
    const { values, setFieldValue } = this.context.formik as FormikProps<any>;
    const { name, profiles } = this.props;

    const socialMediaValues = values[name] || [];
    const selectedFields: boolean[] = [];

    profiles.forEach((profile, index) => {
      const value: string = socialMediaValues[index] ? socialMediaValues[index].url : "";
      setFieldValue(`${name}.${index}`, { type: profile.name, url: value });
      selectedFields[index] = !!value;
    });

    this.setState({ ...this.state, selectedFields });
  }

  toggleProfileVisibility = (index: number): void => {
    const { selectedFields } = this.state;
    selectedFields[index] = !this.state.selectedFields[index];
    this.setState({ selectedFields });
  };

  render(): React.ReactNode {
    const { profiles, className, name } = this.props;
    const { selectedFields } = this.state;

    return (
      <div className={className}>
        <SocialMediaTags
          profiles={profiles}
          onClick={this.toggleProfileVisibility}
          selectedFields={selectedFields}
        />
        <FieldArray
          name={name}
          render={_ =>
            selectedFields.map(
              (singleField: boolean, index: number) =>
                singleField && (
                  <SingleMediaLinkField
                    key={index}
                    name={`${name}.${index}`}
                    profile={profiles[index]}
                  />
                ),
            )
          }
        />
      </div>
    );
  }
}
