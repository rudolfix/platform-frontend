const tsConfig = require("./tsconfig.json");
const config = require("@neufund/eslint-config");

/**
 * Plugin and parser resolution has been updated in ESLint 7.0 therefore it's not longer compatible
 * with out monorepo given typescript version is not in sync in monorepo
 * @see https://eslint.org/docs/user-guide/migrating-to-7.0.0#plugin-resolution-has-been-updated
 */
const eslint7Patch = {
  parser: config.parser,
  plugins: config.plugins,
};

module.exports = {
  ...eslint7Patch,

  root: true,
  extends: "@neufund/eslint-config/react-native",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./tsconfig.*.json"],
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react-native",
            importNames: ["Platform"],
            message: `Please use Platform from "utils/Platform" instead to have better type-safety.`,
          },
        ],
      },
    ],

    "@typescript-eslint/no-magic-numbers": [
      "error",
      {
        ignore: [0, 0.5, 1, 2, 3, 4, 10],
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"],
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
        },
        pathGroups: Object.keys(tsConfig.compilerOptions.paths).map(path => ({
          // e.g. "assets/*" => "assets/**"
          pattern: `${path}*`,
          group: "external",
          position: "after",
        })),
        pathGroupsExcludedImportTypes: ["builtin"],
      },
    ],
    "import/no-relative-parent-imports": "error",
  },
  overrides: [
    {
      files: ["**/*.stories.*", "**/*.spec.*", "**/e2e/**"],
      rules: {
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
      },
    },
  ],
};
