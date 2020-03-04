const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const merge = require("webpack-merge");
const path = require("path");

const configCommon = require("./webpack.config.common");
const paths = require("./paths");

// CircleCI is starting to run out of memory due to minimization processes like Terser
//

module.exports = merge.smart(configCommon, {
  devtool: false,
  mode: "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
    minimize: false
  },
  output: {
    filename: "[chunkhash].[name].min.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[contenthash].[name].css",
    }),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              // TODO: Remove when we know the reason of invalid import order
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
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
                  config: {
                    path: path.join(__dirname, "postcss.config.js"),
                  },
                },
              },
              {
                loader: "sass-loader",
              },
              {
                loader: "sass-resources-loader",
                options: {
                  resources: [paths.neufundTheme],
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
                  config: {
                    path: path.join(__dirname, "postcss.config.js"),
                  },
                },
              },
              {
                loader: "sass-loader",
              },
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
                },
              },
            ],
            include: paths.app,
          },
        ],
      },
    ],
  },
});
