const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const merge = require("webpack-merge");

const configCommon = require("./webpack.config.ci.prod");

module.exports = merge.smart(configCommon, {
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            // for details see https://github.com/ethereum/web3.js/issues/1356
            reserved: ["BigNumber"],
          },
        },
      }),
      new OptimizeCSSAssetsPlugin(),
      new webpack.HashedModuleIdsPlugin(),
    ],
  },
});
