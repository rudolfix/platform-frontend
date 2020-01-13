const tc = require("typechain/dist/TypeChain");
const path = require("path");
const fs = require("fs");
const generator = require("ts-generator");

const { getArtifactsMeta, getArtifactsPath } = require("./getArtifacts");
const loadAppEnv = require("../webpack/loadAppEnv");
const { getArtifactsRelativePath } = require("./getArtifacts");

loadAppEnv(process.env);

const artifactsVersion = process.env.NF_CONTRACT_ARTIFACTS_VERSION || "localhost";

const outDir = "app/lib/contracts";

async function generateKnownInterfaces() {
  const { KNOWN_INTERFACES } = getArtifactsMeta(artifactsVersion);
  fs.writeFileSync(
    path.resolve(__dirname, "..", outDir, "knownInterfaces.json"),
    JSON.stringify(KNOWN_INTERFACES, null, "  "),
  );
}

(async function() {
  const cwd = process.cwd();

  await generator
    .tsGenerator(
      { cwd },
      new tc.TypeChain({
        cwd: process.cwd(),
        rawConfig: {
          files: `${getArtifactsRelativePath(artifactsVersion)}/contracts/*.json`,
          outDir: outDir,
          target: "web3-v1",
        },
      }),
    )
    .catch(e => {
      console.error("Failed to generate typechain contract wrappers");
      console.error(e.message);
      process.exit(1);
    })
    .then(() => generateKnownInterfaces())
    .catch(e => {
      console.error("Failed to read meta.json and generate knownInterfaces.json");
      console.error(e.message);
      process.exit(1);
    });
})();
