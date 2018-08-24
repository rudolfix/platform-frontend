import * as cn from "classnames";
import * as React from "react";

import { InlineIcon } from "./InlineIcon";

import * as facebook from "../../assets/img/inline_icons/social_facebook.svg";
import * as github from "../../assets/img/inline_icons/social_github.svg";
import * as gplus from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagram from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedin from "../../assets/img/inline_icons/social_linkedin.svg";
import * as medium from "../../assets/img/inline_icons/social_medium.svg";
import * as reddit from "../../assets/img/inline_icons/social_reddit.svg";
import * as slack from "../../assets/img/inline_icons/social_slack.svg";
import * as telegram from "../../assets/img/inline_icons/social_telegram.svg";
import * as twitter from "../../assets/img/inline_icons/social_twitter.svg";
import * as xing from "../../assets/img/inline_icons/social_xing.svg";
import * as youtube from "../../assets/img/inline_icons/social_youtube.svg";
import * as styles from "./SocialProfilesList.module.scss";

export type TSocialChannelType =
  | "facebook"
  | "github"
  | "gplus"
  | "instagram"
  | "linkedin"
  | "medium"
  | "reddit"
  | "slack"
  | "telegram"
  | "twitter"
  | "xing"
  | "bitcointalk"
  | "youtube";

export interface IEtoSocialProfile {
  type: string;
  url: string;
}

type TLayoutSize = "small";
type TLayoutPosition = "center";

interface IProps {
  profiles: IEtoSocialProfile[];
  layoutIconSize?: TLayoutSize;
  layoutIconsPosition?: TLayoutPosition;
}

export const SOCIAL_PROFILES: {
  [key: string]: string;
} = {
  facebook,
  github,
  gplus,
  instagram,
  linkedin,
  medium,
  reddit,
  slack,
  telegram,
  twitter,
  xing,
  youtube,
};

export const SocialProfilesList: React.SFC<IProps> = ({
  profiles,
  layoutIconSize,
  layoutIconsPosition,
}) => {
  return (
    <div className={cn(styles.socialProfilesList, layoutIconSize, layoutIconsPosition)}>
      {profiles.map(
        ({ type, url }) =>
          url && (
            <div className={styles.profile} key={type}>
              <a href={url} target="_blank" title={url}>
                <InlineIcon svgIcon={SOCIAL_PROFILES[type]} />
              </a>
              <span className={styles.label}>{type}</span>
            </div>
          ),
      )}
    </div>
  );
};
