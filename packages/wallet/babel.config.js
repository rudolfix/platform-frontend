module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "babel-plugin-parameter-decorator",
    [
      "module-resolver",
      {
        cwd: "babelrc",
        extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
        alias: {
          "assets": "./app/components/assets",
        },
      },
    ],
  ],
};
