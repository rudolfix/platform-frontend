const webpack = require("@cypress/webpack-preprocessor");

// load .env file
require("dotenv").config();

module.exports = on => {
  const options = {
    webpackOptions: require("../../webpack/webpack.config.cypress"),
  };
  on("file:preprocessor", webpack(options));

  require("cypress-log-to-output").install(on, (type, event) => {
    // log only errors
    if (event.level === "error" || event.type === "error") {
      return true;
    }

    return false;
  });
};
