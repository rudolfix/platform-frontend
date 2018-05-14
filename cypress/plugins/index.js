const webpack = require("@cypress/webpack-preprocessor");

module.exports = on => {
  const options = {
    webpackOptions: require("../../webpack/webpack.config.cypress"),
  };

  on("file:preprocessor", webpack(options));
};
