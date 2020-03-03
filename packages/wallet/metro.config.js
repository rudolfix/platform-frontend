const path = require("path");

const projectRoot = path.resolve(__dirname);
const workspaceRoot = path.resolve(projectRoot, "../..");

// All linked packages used in the react-native should be linked here
// otherwise metro is not able to resolve the modules paths
const symlinkedModules = {
  "@neufund/shared": path.resolve(projectRoot, "../shared"),
  "@neufund/shared-modules": path.resolve(projectRoot, "../shared-modules"),
  "@neufund/sagas": path.resolve(projectRoot, "../sagas"),
};

module.exports = {
  projectRoot,
  transformer: {
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
    extraNodeModules: symlinkedModules,
  },
};
