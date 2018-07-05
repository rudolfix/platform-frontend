import { action, configureActions } from "@storybook/addon-actions";

import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SocialProfilesEditor } from "./SocialProfilesEditor";

import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as githubIcon from "../../assets/img/inline_icons/social_github.svg";
import * as googlePlusIcon from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagramIcon from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as slackIcon from "../../assets/img/inline_icons/social_slack.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import * as twitterIcon from "../../assets/img/inline_icons/social_twitter.svg";
import * as xingIcon from "../../assets/img/inline_icons/social_xing.svg";
import * as youtubeIcon from "../../assets/img/inline_icons/social_youtube.svg";

const profiles = [
  {
    name: "Facebook",
    url: "facebook.com",
    svgIcon: facebookIcon,
  },
  {
    name: "LinkedIn",
    url: "linkedin.com",
    svgIcon: linkedinIcon,
  },
  {
    name: "Twitter",
    svgIcon: twitterIcon,
  },
  {
    name: "Slack",
    svgIcon: slackIcon,
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
  {
    name: "Github",
    svgIcon: githubIcon,
  },
  {
    name: "Instagram",
    svgIcon: instagramIcon,
  },
  {
    name: "Google+",
    svgIcon: googlePlusIcon,
  },
  {
    name: "YouTube",
    svgIcon: youtubeIcon,
  },
  {
    name: "Xing",
    svgIcon: xingIcon,
  },
];

storiesOf("SocialProfilesEditor", module).add("default", () => (
  <SocialProfilesEditor profiles={profiles} name="name"/>
));
