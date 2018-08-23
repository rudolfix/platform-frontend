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

  // we are combining the NODE_ENV variable with the local variables from the .env file
  // we can't simply pass all envs from process.env because they would become part of the bundle
  const bundle = {
    NODE_ENV: process.env.NODE_ENV || "development",
  };
  if (process.env.NF_ENABLE_TRANSLATE_OVERLAY) {
    bundle.NF_ENABLE_TRANSLATE_OVERLAY = process.env.NF_ENABLE_TRANSLATE_OVERLAY;
  }

  const allEnvs = Object.assign({}, bundle, envs);

  // extract universe address from contract artifacts repo meta.json
  // overrides .env value, if meta.json exists, but not process.env
  if (allEnvs.NF_CONTRACTS_NEW === "1" && !process.env.NF_UNIVERSE_CONTRACT_ADDRESS && allEnvs.NF_CONTRACT_ARTIFACTS_VERSION) {
    try {
      const meta = require(`../git_modules/platform-contracts-artifacts/${
        allEnvs.NF_CONTRACT_ARTIFACTS_VERSION
      }/meta.json`);
      allEnvs.NF_UNIVERSE_CONTRACT_ADDRESS = meta.CONFIG.addresses.UNIVERSE_MANAGER;
      console.log(meta)
    } catch (e) {
      console.error("cannot read meta.json in contract artifacts", e.message);
      console.error("not overriding NF_UNIVERSE_CONTRACT_ADDRESS");
    }
  } else {
    console.log(allEnvs.NF_CONTRACTS_NEW, process.env.NF_UNIVERSE_CONTRACT_ADDRESS, allEnvs.NF_CONTRACT_ARTIFACTS_VERSION)
  }
  console.log(allEnvs)

  mapValues(allEnvs, JSON.stringify);
};
