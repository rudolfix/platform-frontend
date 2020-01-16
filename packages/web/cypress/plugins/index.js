const webpack = require("@cypress/webpack-preprocessor");

// load .env file
require("dotenv").config();

module.exports = on => {
  require("cypress-log-to-output").install(on, (type, event) => {
    // log only errors
    return event.level === "error" || event.type === "error";
  });

  const options = {
    webpackOptions: require("../../webpack/webpack.config.cypress"),
  };
  on("file:preprocessor", webpack(options));

  // open dev tools for new tabs
  on("before:browser:launch", (browser = {}, args) => {
    if (browser.name === "chrome") {
      args = args.concat("--auto-open-devtools-for-tabs");
    } else if (browser.name === "electron") {
      // Cypress-specific option (state)
      args.devTools = true;
    }
    return args;
  });
};
