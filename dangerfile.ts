import { fail, danger, message } from "danger";

const currentCommitSHA = danger.git.commits[danger.git.commits.length - 1].sha;

function checkPackageLock() {
  const hasPackageLock =
    danger.git.created_files.filter(p => p.includes("package-lock.json")).length > 0;

  if (hasPackageLock) {
    fail("Detected package-lock.json, failing build. Do not use npm, use yarn instead.");
  }
}

function reportVisualRegression() {
  try {
    const reportLink = `https://s3.eu-central-1.amazonaws.com/neufund-platform-screenshots/${currentCommitSHA}/report/index.html`;

    const reportData = require("./.reg/out.json");

    message(`[Visual regression report](${reportLink})
    Changed files: **${reportData.failedItems.length}**
    New files: **${reportData.newItems.length}**
    Deleted files: **${reportData.deletedItems.length}**
    `);
  } catch (e) {
    console.error("Error: ", e);
    fail("Could not access visual regression report");
  }
}

checkPackageLock();
// reportVisualRegression();
// TODO: Check Visual Regression
