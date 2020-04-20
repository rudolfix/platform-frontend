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
  },
};
