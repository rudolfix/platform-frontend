// tslint:disable-next-line:no-implicit-dependencies
import { action, configureActions } from "@storybook/addon-actions";
// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SocialProfilesEditor } from "./SocialProfilesEditor";

import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";

const profiles = [
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

storiesOf("SocialProfilesEditor", module).add("default", () => (
  <SocialProfilesEditor profiles={profiles} />
));
