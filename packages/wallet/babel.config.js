module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "babel-plugin-parameter-decorator",
    [
      "module-resolver",
      {
        root: ['./app'],
        extensions: [".ts", ".tsx", ".js", ".ios.js", ".android.js"],
        alias: {
          "assets": "./app/assets",
          "modules": "./app/modules",
          "store": "./app/store",
        },
      },
    ],
  ],
};
