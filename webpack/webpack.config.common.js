const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  entry: ["./app/index.tsx"],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: paths.dist,
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      favicon: paths.favicon,
    }),
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ],
};
