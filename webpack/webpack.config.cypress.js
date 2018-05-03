const paths = require("./paths");

module.exports = {
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
            },
          },
        ],
        include: paths.app,
      },
    ],
  },
};
