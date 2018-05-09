const paths = require("./paths");

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
};
