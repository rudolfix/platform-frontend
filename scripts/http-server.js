const { join } = require("path");
const express = require("express");
const https = require("https");
const proxy = require("http-proxy-middleware");
const fallback = require("express-history-api-fallback");
const fs = require("fs");

const sslOptions = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

const PORT = 9090;

const app = express();

app.use(
  "/node",
  proxy({ target: "http://localhost:8545", pathRewrite: { "^/node": "" }, changeOrigin: true }),
);

app.use(
  "/api/signature",
  proxy({
    target: "http://localhost:5000/",
    pathRewrite: { "^/api/signature": "" },
    changeOrigin: true,
  }),
);

app.use(
  "/api/wallet",
  proxy({
    target: "http://localhost:5001/",
    pathRewrite: { "^/api/wallet": "" },
    changeOrigin: true,
  }),
);

app.use(
  "/api/user",
  proxy({ target: "http://localhost:5002", pathRewrite: { "^/api/user": "" }, changeOrigin: true }),
);

app.use(
  "/api/kyc",
  proxy({ target: "http://localhost:5003/", pathRewrite: { "^/api/kyc": "" }, changeOrigin: true }),
);

app.use("/", express.static(join(__dirname, "../dist"), { extensions: ["html"] }));
app.use(fallback("index.html", { root: join(__dirname, "../dist") }));

console.log(`Serving on ${PORT}`);
https.createServer(sslOptions, app).listen(PORT);
