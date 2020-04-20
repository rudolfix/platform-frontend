module.exports = {
  root: true,
  extends: "@neufund/eslint-config/react-native",
  "parserOptions": {
    tsconfigRootDir: __dirname,
    "project": ["./tsconfig.json", "./tsconfig.*.json"]
  },
};
