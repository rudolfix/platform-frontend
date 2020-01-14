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
};
