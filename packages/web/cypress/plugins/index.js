const webpack = require("@cypress/webpack-preprocessor");

// load .env file
require("dotenv").config();

module.exports = on => {
  require("cypress-log-to-output").install(on);

  const options = {
    webpackOptions: require("../../webpack/webpack.config.cypress"),
  };
  on("file:preprocessor", webpack(options));
};
