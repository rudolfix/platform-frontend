const path = require("path");
const paths = require("../webpack/paths");
const devConfig = require("../webpack/webpack.config.dev");
const webpack = require("webpack");

module.exports = (baseConfig, env, config) => {
  const pathToStyleLoader = path.join(__dirname, "./setup-styles.ts");

  config.entry.preview.push(pathToStyleLoader);

  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/^react-intl-phraseapp$/, data => {
      data.request = data.request.replace("react-intl-phraseapp", "react-intl");
    }),
  );

  config.module.rules = [...devConfig.module.rules];

  config.resolve.extensions = devConfig.resolve.extensions;

  return config;
};
