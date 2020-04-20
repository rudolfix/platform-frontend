module.exports = {
  env: {
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    // turn off some recommended options that don't align with our styleguide
    "require-yield": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": "off",

    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
    ],
    "@typescript-eslint/no-base-to-string": "error",
    "@typescript-eslint/no-dynamic-delete": "error",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-implied-eval": "error",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-throw-literal": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/no-unnecessary-qualifier": "error",
    "@typescript-eslint/no-unnecessary-type-arguments": "error",
    // TODO: Enable when Stack provides a proper navigation
    // "@typescript-eslint/no-unsafe-member-access": "error",
    // "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/require-array-sort-compare": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/unified-signatures": "error",

    /**
     * Import eslint rules
     */
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
      },
    ],

    // "arrow-body-style": ["error", "as-needed"],
    //
    // "constructor-super": "error",
    //   "curly": [
    //       "error",
    //       "multi-line"
    //   ],
    //   "eqeqeq": [
    //       "error",
    //       "always"
    //   ],
    //
    //   "import/no-internal-modules": "off",
    //   "import/order": "error",
    //
    //   "no-console": "error",
    //   "no-constant-condition": "off",
    //   "no-debugger": "error",
    //   "no-duplicate-case": "error",
    //   "no-duplicate-imports": "error",
    //   "no-eval": "error",
    //   "no-fallthrough": "error",
    //   "no-invalid-regexp": "error",
    //   "no-invalid-this": "off",
    //   "no-redeclare": "error",
    //   "no-regex-spaces": "error",
    //   "no-restricted-imports": [
    //       "error",
    //       {
    //           "paths": [
    //               {
    //                   "name": "react-intl",
    //                   "importNames": [
    //                       "FormattedMessage",
    //                       "FormattedHTMLMessage"
    //                   ]
    //               }
    //           ]
    //       }
    //   ],
    //   "no-sequences": "error",
    //   "no-shadow": [
    //       "error",
    //       {
    //           "hoist": "never"
    //       }
    //   ],
    //   "no-sparse-arrays": "error",
    //   "no-template-curly-in-string": "error",
    //   "no-throw-literal": "error",
    //   "no-var": "error",
    //   "prefer-object-spread": "error",
    //   "radix": "error",
    //   "use-isnan": "error",
  },
};
