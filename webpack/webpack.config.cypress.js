const webpack = require("webpack");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              configFileName: "./cypress/tsconfig.json",
              useCache: true,
              errorsAsWarnings: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
  ],
};
