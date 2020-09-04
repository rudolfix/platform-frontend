const tsConfig = require("./tsconfig.json");

// transform {"assets/*": ["app/assets/*"]} => {"assets": "./app/assets" }
const moduleNameMapper = Object.entries(tsConfig.compilerOptions.paths).reduce(
  (alias, [key, value]) => {
    const aliasName = "^" + key.replace("/*", "(.*)$");
    return {
      ...alias,
      [aliasName]: "<rootDir>/" + value[0].replace("/*", "/$1"),
    };
  },
  {},
);

module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js)$": "babel-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.unit.json",
    },
  },
  setupFiles: ["./jest-setup-file.specUtils.ts"],
  modulePathIgnorePatterns: ["<rootDir>/tests/e2e/"],
  setupFilesAfterEnv: ["@testing-library/react-native/cleanup-after-each"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/app/__mocks__/fileMock.ts",
    ...moduleNameMapper,
  },
  cacheDirectory: ".jest/cache",
};
