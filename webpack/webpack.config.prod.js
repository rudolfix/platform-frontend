const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const merge = require("webpack-merge");

const configCommon = require("./webpack.config.common");
const paths = require("./paths");

module.exports = merge(configCommon, {
  output: {
    filename: "[name].[hash].min.js",
  },
  plugins: [
    new CleanWebpackPlugin(paths.dist, {
      root: paths.root,
    }),
    new ExtractTextPlugin("styles.css"), // TODO: its not working created issue 93
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
      },
    }),
  ],
  module: {
    rules: [
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
    ],
  },
});
