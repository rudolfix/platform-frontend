module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js"],
  transform: {
    "^.+\\.(js)$": "babel-jest",
    "\\.(ts|tsx)$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.unit.json",
      babelConfig: true,
    },
  },
  setupFiles: ["./jest-setup-file.specUtils.ts"],
  modulePathIgnorePatterns: ["<rootDir>/tests/e2e/"],
  setupFilesAfterEnv: ["@testing-library/react-native/cleanup-after-each"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/app/__mocks__/fileMock.ts",
  },
  cacheDirectory: ".jest/cache",
};
