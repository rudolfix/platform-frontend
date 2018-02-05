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
  module: {
    rules: [
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
          {
            test: /\.(jpg|png|svg)$/,
            loader: "url-loader",
            options: {
              limit: 25000,
              publicPath: "/",
            },
          },
          {
            test: /\.(woff2|woff|ttf|eot|otf)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[hash].[ext]",
            },
          },
        ],
      },
    ],
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
  ],
};
