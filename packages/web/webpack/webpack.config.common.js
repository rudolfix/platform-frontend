const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const appEnv = loadAppEnv();

module.exports = {
  entry: ["babel-regenerator-runtime", "./app/index.tsx"],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: paths.dist,
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./app/external/**/*", to: "./external", flatten: true }], {
      copyUnmodified: true,
    }),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      favicon: paths.favicon,
    }),
    // TODO: Find a way to warn if not defined env variable is used in the code
    // Note: It's very important to spread the env variables manually `process.env.MY_ENV`
    // so webpack will replace the value properly.
    // If we set the value to `"process.env": appEnv` then webpack will replace it as
    // `{ MY_ENV: "1", ...ALL_MY_OTHER_ENVS... }.MY_ENV` making it harder for minifier to eliminate dead code
    new webpack.DefinePlugin({
      // for consistency with Wallet app, use __DEV__ instead of process.env.NODE_ENV
      __DEV__: appEnv.NODE_ENV === '"development"',
      ...Object.entries(appEnv).reduce(
        (definitions, [key, value]) => ({
          ...definitions,
          [`process.env.${key}`]: value,
        }),
        {},
      ),
    }),
    // import only `en-gb` locale from moment (which is a default one)
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(jpg|png|svg|gif)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "images/[hash:8].[ext]",
            },
          },
          {
            test: /\.(mp4|webm)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "videos/[hash:8].[ext]",
            },
          },
          // raw-loader for svg is used inside `paths.inlineIcons` directory only
          {
            test: /\.(svg)$/,
            loader: "raw-loader",
            include: paths.inlineIcons,
          },
          {
            test: /\.(woff2|woff|ttf|eot|otf)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
};
