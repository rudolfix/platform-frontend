const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const merge = require("webpack-merge");

const configCommon = require("./webpack.config.common");
const paths = require("./paths");

module.exports = merge(configCommon, {
  output: {
    filename: "[hash].[name].min.js",
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist, {
      root: paths.root,
    }),
    new ExtractTextPlugin({
      filename: "[contenthash].[name].css",
      allChunks: true,
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
      },
    }),
  ],
  module: {
    rules: [
      {
        // there is a lof of duplication with dev config but merge.smart fails
        // when using oneOf so for now we can leave it like this
        oneOf: [
          {
            test: /\.module.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    modules: true,
                    localIdentName: "[name]__[local]___[hash:base64:5]",
                    camelCase: "dashesOnly",
                    minimize: true,
                  },
                },
                { loader: "sass-loader" },
              ],
            }),
          },
          {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    modules: false,
                    localIdentName: "[name]__[local]___[hash:base64:5]",
                    camelCase: "dashesOnly",
                    minimize: true,
                  },
                },
                { loader: "sass-loader" },
              ],
            }),
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    modules: false,
                    localIdentName: "[name]__[local]___[hash:base64:5]",
                    camelCase: "dashesOnly",
                  },
                },
              ],
            }),
          },
          {
            test: /\.(tsx?)$/,
            use: [
              {
                loader: "awesome-typescript-loader",
                options: {
                  configFileName: "./tsconfig.json",
                  useCache: false,
                },
              },
            ],
            include: paths.app,
          },
          {
            test: /\.(jpg|png|svg)$/,
            loader: "url-loader",
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
});
