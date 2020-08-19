const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const paths = require("./paths");
const { peerDependencies } = require("../package");

const webpackConfig = (env, argv = {}) => {
  const analyzerMode = argv.analyze || "disabled";

  return {
    mode: process.env.NODE_ENV,
    entry: ["./src/index.ts"],
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    output: {
      path: paths.dist,
      publicPath: "/",
      library: "",
      libraryTarget: "umd",
      filename: "index.js",
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "styles/[name].css",
      }),
      new CopyWebpackPlugin(
        [
          // copy these because they aren't bundled
          { from: "src/styles", to: "styles" },
        ],
        {
          copyUnmodified: true,
        },
      ),
      new BundleAnalyzerPlugin({ analyzerMode }),
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV === "development",
      }),
    ],
    optimization: {
      // minification is turned off to keep component names
      // and it will be minified when bundled with web
      minimize: false,
    },
    // node modules that are used by web pkg and hence shouldn't be bundled
    externals: [...Object.keys(peerDependencies), "lodash/fp"],
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.module.scss$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                  options: {
                    sourceMap: true,
                    importLoaders: 3,
                    modules: {
                      localIdentName: "[name]__[local]___[hash:base64:5]",
                    },
                    localsConvention: "dashesOnly",
                  },
                },
                {
                  loader: "postcss-loader",
                  options: {
                    config: { path: paths.postCSSConfig },
                  },
                },
                {
                  loader: "sass-loader",
                },
                {
                  loader: "sass-resources-loader",
                  options: {
                    resources: paths.sassResource,
                  },
                },
              ],
            },
            {
              test: /\.scss$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 2,
                  },
                },
                {
                  loader: "postcss-loader",
                  options: {
                    config: { path: path.join(__dirname, "postcss.config.js") },
                  },
                },
                { loader: "sass-loader" },
              ],
            },
            {
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: "css-loader",
                },
              ],
            },
            {
              test: /\.(tsx?)$/,
              use: [
                {
                  loader: "ts-loader",
                  options: {
                    configFile: "tsconfig.json",
                    experimentalWatchApi: true,
                  },
                },
              ],
              include: paths.src,
            },
            {
              test: /\.(jpg|png|svg|gif|webm|mp4)$/,
              loader: "url-loader",
              include: paths.assets,
              exclude: paths.inlineIcons,
              options: {
                limit: 25000,
                publicPath: "/",
              },
            },
            {
              test: /\.(svg)$/,
              loader: "raw-loader",
              include: paths.inlineIcons,
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
  };
};

module.exports = webpackConfig;
