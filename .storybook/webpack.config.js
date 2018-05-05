const path = require("path");
const paths = require("../webpack/paths");

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("awesome-typescript-loader"),
  });

  config.module.rules.push({
    test: /\.module.scss$/,
    use: [
      {
        loader: require.resolve("style-loader"),
      },
      {
        loader: require.resolve("css-loader"),
        options: {
          importLoaders: 1,
          modules: true,
          localIdentName: "[name]__[local]___[hash:base64:5]",
          camelCase: "dashesOnly",
        },
      },
      {
        loader: require.resolve("sass-loader"),
      },
    ],
  });

  config.module.rules.push({
    test: /\.(jpg|png|svg)$/,
    loader: "url-loader",
    exclude: paths.inlineIcons,
    options: {
      limit: 25000,
      publicPath: "/",
    },
  });

  config.module.rules.push({
    test: /\.(svg)$/,
    loader: "raw-loader",
    include: paths.inlineIcons,
  });

  config.resolve.extensions.push(".ts", ".tsx", ".scss");

  return config;
};
