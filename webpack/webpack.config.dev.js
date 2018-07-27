const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

const generateProxyConfig = require("./proxy-urls");
const configCommon = require("./webpack.config.common");
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
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-eval' www.google-analytics.com/analytics.js " +
        "'unsafe-inline' *; frame-src *; " + // this should be only enabled for twitter.html
        "style-src fonts.googleapis.com 'self' 'unsafe-inline' " +
        "*; " + // this should be only enabled for twitter.html
        "font-src 'self' fonts.gstatic.com; " +
        "img-src 'self' data: documents.neufund.io documents.neufund.net www.google-analytics.com stats.g.doubleclick.net " +
        "*; " + // this should be only enabled for twitter.html
        "connect-src 'self' wss://localhost:9090", // needed for hot reload
    },
    proxy: generateProxyConfig("http://localhost"),
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
        // there is a lof of duplication with prod config but merge.smart fails
        // when using oneOf so for now we can leave it like this
        oneOf: [
          {
            test: /\.module.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              {
                loader: "postcss-loader",
                options: { config: { path: path.join(__dirname, "postcss.config.js") } },
              },
              {
                loader: "sass-loader",
              },
              {
                loader: "sass-resources-loader",
                options: {
                  resources: [path.join(__dirname, "../app/styles/neufund-theme.scss")],
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: "style-loader",
              },
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: false,
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  camelCase: "dashesOnly",
                },
              },
              { loader: "sass-loader" },
            ],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader",
              },
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
          },
          {
            test: /\.(tsx?)$/,
            use: [
              {
                loader: "awesome-typescript-loader",
                options: {
                  configFileName: "./tsconfig.dev.json",
                  useCache: true,
                  // errorsAsWarnings: true, // uncomment this to be able to run application with type errors
                },
              },
            ],
            include: paths.app,
          },
          {
            test: /\.(jpg|png|svg|gif)$/,
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
