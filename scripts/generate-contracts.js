const loadAppEnv = require("../webpack/loadAppEnv");
const tc = require("typechain");
const path = require("path");
const fs = require("fs");

const applicationEnv = loadAppEnv(process.env);
let artifactsVersion = "localhost";
try {
  // @ts-ignore
  artifactsVersion = JSON.parse(applicationEnv.NF_CONTRACT_ARTIFACTS_VERSION);
} catch (e) {}

const contractsPath = `git_modules/platform-contracts-artifacts/${artifactsVersion}`;
const outDir = "app/lib/contracts";

// @ts-ignore
global.IS_CLI = true;

async function generateKnownInterfaces() {
  const knownInterfaces = require(`../${contractsPath}/meta.json`).KNOWN_INTERFACES;
  fs.writeFileSync(
    path.resolve(__dirname, "..", outDir, "knownInterfaces.json"),
    JSON.stringify(knownInterfaces, null, "  "),
  );
}

tc.generateTypeChainWrappers({
  outDir,
  glob: `${contractsPath}/contracts/*.json`,
  force: true,
})
  .catch(e => {
    console.error("Faild to generate typechain contract wrappers");
    console.error(e.message);
    process.exit(1);
  })
  .then(() => generateKnownInterfaces())
  .catch(e => {
    console.error("Faild to read meta.json and generate knownInterfaces.json");
    console.error(e.message);
    process.exit(1);
  });
