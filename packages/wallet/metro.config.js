const path = require("path");
const { getDefaultConfig } = require("metro-config");

const projectRoot = path.resolve(__dirname);
const workspaceRoot = path.resolve(projectRoot, "../..");

const extraNodeModules = {
  // All linked packages used in the react-native should be linked here
  // otherwise metro is not able to resolve the modules paths
  "@neufund/shared-utils": path.resolve(projectRoot, "../shared"),
  "@neufund/shared-modules": path.resolve(projectRoot, "../shared-modules"),
  "@neufund/sagas": path.resolve(projectRoot, "../sagas"),
  crypto: require.resolve("react-native-crypto"),
  stream: require.resolve("stream-browserify"),
  vm: require.resolve("vm-browserify"),
};

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    projectRoot,
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    // Watch also workspace root to properly resolve hoisted dependencies
    watchFolders: [workspaceRoot],
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
      extraNodeModules,
    },
  };
})();
