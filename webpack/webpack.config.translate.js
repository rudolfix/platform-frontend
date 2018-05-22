const merge = require("webpack-merge");
const devRemoteConfig = require("./webpack.config.dev-remote");

const loadAppEnv = require("./loadAppEnv");
const applicationEnv = loadAppEnv(process.env);

if (!applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT) {
  throw new Error("Missing NF_REMOTE_BACKEND_PROXY_ROOT env variable. Add it to your .env file");
}

const backendUrl = JSON.parse(applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT);

const localDevConfig = merge(devRemoteConfig, {
  devServer: {
    headers: { "Content-Security-Policy": "" },
  },
});

module.exports = localDevConfig;
