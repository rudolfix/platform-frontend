const merge = require("webpack-merge");
const devConfig = require("./webpack.config.dev");

const generateProxyConfig = require("./proxy-urls");
const loadAppEnv = require("./loadAppEnv");
const applicationEnv = loadAppEnv(process.env);

if (!applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT) {
  throw new Error("Missing NF_REMOTE_BACKEND_PROXY_ROOT env variable. Add it to your .env file");
}

const backendUrl = JSON.parse(applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT);

console.log("REMOTE_BACKEND_URL: ", backendUrl);

const localDevConfig = merge(devConfig, {
  devServer: {
    proxy: generateProxyConfig("remote", backendUrl),
  },
});

module.exports = localDevConfig;
