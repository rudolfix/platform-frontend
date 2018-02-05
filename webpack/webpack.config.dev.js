const configCommon = require("./webpack.config.common");
const merge = require("webpack-merge");
const webpack = require("webpack");

const paths = require("./paths");

module.exports = merge(configCommon, {
  devServer: {
    contentBase: paths.dist,
    host: "localhost",
    port: 9090,
    https: true,
    hot: true,
    overlay: true,
    historyApiFallback: true,
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
  ],
  plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["react-hot-loader/babel"],
            },
          },
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: "./tsconfig.dev.json",
              useCache: true,
            },
          },
        ],
        include: paths.app,
      },
    ],
  },
});
