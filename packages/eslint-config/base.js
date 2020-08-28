module.exports = {
  env: {
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    // turn off some recommended options that don't align with our styleguide
    "require-yield": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",

    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    complexity: ["error", { max: 10 }],
    "no-await-in-loop": "error",
    "no-console": "error",
    "no-template-curly-in-string": "error",
    "require-atomic-updates": "error",
    "default-case": "error",
    "no-constructor-return": "error",
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-floating-decimal": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-lone-blocks": "error",
    "no-loop-func": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-implicit-globals": "error",
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "lodash",
            message: "Please use lodash submodules imports."
          }
        ]
      }
    ],
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-shadow": "error",
    "no-sequences": "error",
    "no-unmodified-loop-condition": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-void": "error",
    "prefer-arrow-callback": [
      "error",
      { allowNamedFunctions: true, allowUnboundThis: false }
    ],
    "prefer-promise-reject-errors": "error",
    "prefer-regex-literals": "error",
    radix: "error",
    "wrap-iife": "error",
    yoda: "error",

    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      { assertionStyle: "as", objectLiteralTypeAssertions: "never" }
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
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/require-array-sort-compare": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/unified-signatures": "error",
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/no-empty-function": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        caughtErrors: "all",
        args: "all",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }
    ],
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-magic-numbers": [
      "error",
      {
        // 0 is often used to access first element of an array
        ignore: [0],
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true
      }
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false
      }
    ],

    /**
     * Import eslint rules
     */
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          ["internal", "parent", "sibling", "index"]
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc"
        }
      }
    ],
    "import/export": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-absolute-path": "error",
    "import/no-default-export": "error",
    "import/no-duplicates": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-mutable-exports": "error",
    "import/no-named-default": "error",
    "import/no-nodejs-modules": "error",
    "import/no-unassigned-import": "error",
    "import/no-unused-modules": "error",
    "import/no-useless-path-segments": "error"
  },
  overrides: [
    {
      files: ["**/*.stories.*", "**/*.spec.*", "**/e2e/**"],
      rules: {
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/unbound-method": "off",
        "import/no-nodejs-modules": "off"
      }
    }
  ]
};
