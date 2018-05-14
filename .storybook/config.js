import "reflect-metadata";
import { configure, addDecorator } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import { Provider as ReduxProvider } from "react-redux";
import StoryRouter from "storybook-react-router";

// Load the locale data for all your defined locales
import { addLocaleData } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";

import * as languageEn from "../intl/locales/en-en.json";

// Provide your messages
const messages = {
  en: languageEn,
};

const getMessages = locale => messages[locale];

// Set intl configuration
addLocaleData(enLocaleData);
setIntlConfig({
  locales: ["en"],
  defaultLocale: "en",
  getMessages,
});

// Register decorators
addDecorator(withIntl);
addDecorator(StoryRouter());

// Load storybook
const req = require.context("../app/components/", true, /stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
