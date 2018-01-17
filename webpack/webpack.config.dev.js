const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  devServer: {
    contentBase: paths.dist,
    host: "localhost",
    port: 9090,
    https: true,
    hot: true,
    overlay: true,
    proxy: {
      "/node": {
        target: "http://localhost:8545",
        pathRewrite: { "^/node": "" },
      },
    },
  },
  entry: [
    "react-hot-loader/patch",
    "webpack-dev-server/client?http://localhost:9090",
    "webpack/hot/only-dev-server",
    "./app/index.tsx",
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: paths.dist,
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loaders: ["react-hot-loader/webpack", "awesome-typescript-loader"],
        include: paths.app,
      },
      {
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              { loader: "sass-loader" },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              { loader: "sass-loader" },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
  ],
};
