const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    new CopyWebpackPlugin([
      { from: './app/twitter.html', to: './' },
    ]),
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
