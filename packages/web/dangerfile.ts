import { danger, fail, message } from "danger";
import { writeFileSync } from "fs";

const main = (): void => {
  checkPackageLock();
  getE2ETestTags();
};

function checkPackageLock(): void {
  if (!danger.github.pr) {
    return;
  }
  const hasPackageLock = danger.git.created_files.includes("package-lock.json");

  if (hasPackageLock) {
    fail("Package lock detected - Do not use npm, use yarn instead.");
  }
  message("No Package lock detected");
}

// We will always run these tests
const alwaysRunningTests: string = "@p1#@p2";

function getE2ETestTags(): void {
  const prBody = danger.github.pr.body;

  // Replacing `,` with ` ` is done for readability purposes only
  const tags = [...new Set(prBody.replace(",", " ").match(/@\w+/g))].join("#");

  writeFileSync("./e2e-test-tags", alwaysRunningTests + tags);

  message("Tags written to to file");
}

main();
