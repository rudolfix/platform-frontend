const { tsGenerator } = require("ts-generator");
const { TypeChain } = require("typechain/dist/TypeChain");
const fs = require("fs");
const path = require("path");

const { getArtifactsRelativePath, getArtifactsMeta } = require("./get-artifacts");

// TODO: Find a way to inject process.env
const artifactsVersion = process.env.NF_CONTRACT_ARTIFACTS_VERSION || "localhost";

const outDir = "app/lib/contracts";

async function generateKnownInterfaces() {
  const { KNOWN_INTERFACES } = getArtifactsMeta(artifactsVersion);

  fs.writeFileSync(
    path.resolve(__dirname, "..", outDir, "knownInterfaces.json"),
    JSON.stringify(KNOWN_INTERFACES, null, "  "),
  );
}

async function generateTypechainWrappers() {
  const cwd = process.cwd();

  await tsGenerator(
    { cwd },
    new TypeChain({
      cwd,
      rawConfig: {
        outDir,
        files: `${getArtifactsRelativePath(artifactsVersion)}/contracts/*.json`,
        target: "ethers",
      },
    }),
  );
}

async function main() {
  try {
    await generateTypechainWrappers();
  } catch (e) {
    console.error("Failed to generate typechain contract wrappers");
    console.error(e.message);
    process.exit(1);
  }

  try {
    await generateKnownInterfaces();
  } catch (e) {
    console.error("Failed to read meta.json and generate knownInterfaces.json");
    console.error(e.message);
    process.exit(1);
  }
}

main();
