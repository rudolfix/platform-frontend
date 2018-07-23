const { join } = require("path");
const { mapValues } = require("lodash");
const dotenv = require("dotenv");

function updateParsedEnvsWithProcessEnvs(parsedEnvs = {}, processEnvs) {
  const result = {};

  Object.keys(parsedEnvs).forEach(k => {
    result[k] = k in processEnvs ? processEnvs[k] : parsedEnvs[k];
  });

  return result;
}

module.exports = function loadAppEnv(processEnv) {
  const dotEnvFileVariables = dotenv.load({ path: join(__dirname, "../.env") }).parsed;
  const envs = updateParsedEnvsWithProcessEnvs(dotEnvFileVariables, processEnv);

  const getEnvBundle = () => {
    const bundle = {
      NODE_ENV: process.env.NODE_ENV || "development",
    };
    if (process.env.NF_ENABLE_TRANSLATE_OVERLAY)
      bundle.NF_ENABLE_TRANSLATE_OVERLAY = process.env.NF_ENABLE_TRANSLATE_OVERLAY;
    return bundle;
  };

  // we are combining the NODE_ENV variable with the local variables from the .env file
  // we can't simply pass all envs from process.env because they would become part of the bundle

  const allEnvs = mapValues(Object.assign({}, getEnvBundle(), envs), JSON.stringify);

  return allEnvs;
};
