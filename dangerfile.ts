import { fail, danger } from "danger";

function checkPackageLock() {
  const hasPackageLock =
    danger.git.created_files.filter(p => p.includes("package-lock.json")).length > 0;

  if (hasPackageLock) {
    fail("Detected package-lock.json, failing build. Do not use npm, use yarn instead.");
  }
}

checkPackageLock();
