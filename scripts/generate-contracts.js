const loadAppEnv = require("../webpack/loadAppEnv");
const tc = require("typechain");

const applicationEnv = loadAppEnv(process.env);
let artifactsVersion = "localhost";
try {
  // @ts-ignore
  artifactsVersion = JSON.parse(applicationEnv.NF_CONTRACT_ARTIFACTS_VERSION);
} catch (e) {}

// @ts-ignore
global.IS_CLI = true;

tc.generateTypeChainWrappers({
  force: true,
  glob: `git_modules/platform-contracts-artifacts/${artifactsVersion}/contracts/*.json`,
  outDir: "app/lib/contracts",
}).catch(e => {
  console.error(e.message);
  process.exit(1);
});
