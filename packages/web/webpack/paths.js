const path = require("path");

module.exports = {
  app: path.join(__dirname, "../app"),
  dist: path.join(__dirname, "../dist"),
  appHtml: path.join(__dirname, "../app/index.html"),
  neufundTheme: path.join(
    __dirname,
    "../../../node_modules/@neufund/design-system/dist/styles/neufund-theme.scss",
  ),
  root: path.join(__dirname, ".."),
  favicon: path.join(__dirname, "../app/assets/favicon_neufund.ico"),
  inlineIcons: path.join(__dirname, "../app/assets/img/inline_icons"),
};
