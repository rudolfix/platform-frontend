const merge = require("webpack-merge");
const devConfig = require("./webpack.config.dev");

const loadAppEnv = require("./loadAppEnv");
const applicationEnv = loadAppEnv(process.env);

if (!applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT) {
  throw new Error("Missing NF_REMOTE_BACKEND_PROXY_ROOT env variable. Add it to your .env file");
}

const backendUrl = JSON.parse(applicationEnv.NF_REMOTE_BACKEND_PROXY_ROOT);

console.log("REMOTE_BACKEND_URL: ", backendUrl);

const localDevConfig = merge(devConfig, {
  devServer: {
    proxy: {
      "/node": {
        target: "http://localhost:8545",
        pathRewrite: { "^/node": "" },
      },
      "/api/signature": {
        target: backendUrl + "signature",
        pathRewrite: { "^/api/signature": "" },
        changeOrigin: true,
      },
      "/api/wallet": {
        target: backendUrl + "wallet",
        pathRewrite: { "^/api/wallet": "" },
        changeOrigin: true,
      },
      "/api/user": {
        target: backendUrl + "user",
        pathRewrite: { "^/api/user": "" },
        changeOrigin: true,
      },
      "/api/kyc": {
        target: backendUrl + "kyc",
        pathRewrite: { "^/api/kyc": "" },
        changeOrigin: true,
      },
      "/api/eto-listing": {
        target: backendUrl + "eto-listing",
        pathRewrite: { "^/api/eto-listing": "" },
        changeOrigin: true,
      },
      "/api/document-storage": {
        target: backendUrl + "document-storage",
        pathRewrite: { "^/api/document-storage": "" },
        changeOrigin: true,
      },
      "/api/newsletter": {
        target: backendUrl + "newsletter",
        pathRewrite: { "^/api/newsletter": "" },
        changeOrigin: true,
      },
    },
  },
});

module.exports = localDevConfig;
