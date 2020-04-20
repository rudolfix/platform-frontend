module.exports = {
  plugins: ["react", "react-hooks"],
  extends: [
    "./base.js",
    "plugin:import/react",
    // "plugin:react/recommended",
    // "prettier/react",
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      },
    },
  },
  rules: {
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
    // "react/jsx-filename-extension": ["error", { "extensions": [".tsx"] }],
    // "react/jsx-props-no-spreading": 0,
    // "react/display-name": 0,
    // "react-hooks/rules-of-hooks": 2,
    // "react-hooks/exhaustive-deps": ["error", { "additionalHooks": "(useCode|useMemoOne)" }]
  },
};
