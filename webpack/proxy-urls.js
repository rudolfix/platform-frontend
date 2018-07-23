const { mapValues } = require("lodash");

/**
 * Unified local proxy configuration. Add new urls here.
 *
 * Params:
 * type: "local" | "remote"
 */
function generateProxyConfig(type, backendUrl) {
  const base = {
    "/node": {
      targetLocal: "http://localhost:8545",
      targetRemote: "http://localhost:8545",
      pathRewrite: { "^/node": "" },
    },
    "/api/signature": {
      targetLocal: "http://localhost:5000",
      targetRemote: backendUrl + "signature",
      pathRewrite: { "^/api/signature": "" },
    },
    "/api/wallet": {
      targetLocal: "http://localhost:5001",
      targetRemote: backendUrl + "wallet",
      pathRewrite: { "^/api/wallet": "" },
    },
    "/api/user": {
      targetLocal: "http://localhost:5002",
      targetRemote: backendUrl + "user",
      pathRewrite: { "^/api/user": "" },
    },
    "/api/kyc": {
      targetLocal: "http://localhost:5003",
      targetRemote: backendUrl + "kyc",
      pathRewrite: { "^/api/kyc": "" },
    },
    "/api/eto-listing": {
      targetLocal: "http://localhost:5009",
      targetRemote: backendUrl + "eto-listing",
      pathRewrite: { "^/api/eto-listing": "" },
    },
    "/api/document-storage": {
      targetLocal: "http://localhost:5015",
      targetRemote: backendUrl + "document-storage",
      pathRewrite: { "^/api/document-storage": "" },
    },
    "/api/newsletter": {
      targetLocal: "http://localhost:5014",
      targetRemote: backendUrl + "newsletter",
      pathRewrite: { "^/api/newsletter": "" },
    },
  };

  return mapValues(base, value => {
    const proxyConfig = {
      pathRewrite: value.pathRewrite,
      target: type === "remote" ? value.targetRemote : value.targetLocal,
    };

    if (type === "remote") {
      proxyConfig.changeOrigin = true;
    }

    return proxyConfig;
  });
}

module.exports = generateProxyConfig;
