const path = require("path");
const paths = require("../webpack/paths");
const devConfig = require("../webpack/webpack.config.dev");

module.exports = (baseConfig, env, config) => {
  const pathToStyleLoader = path.join(__dirname, "./setup-styles.ts");

  config.entry.preview.push(pathToStyleLoader);

  config.module.rules = [...devConfig.module.rules];

  config.resolve.extensions = devConfig.resolve.extensions;

  return config;
};
