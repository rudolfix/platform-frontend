const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const glob = require("glob");

const defaultLocale = "en-en";
const defaultLocalePath = join(__dirname, "../intl/locales/", defaultLocale + ".json");
const messageFilesPath = join(__dirname, "../intl/messages");

function readFileOrDefault(path, def) {
  try {
    return readFileSync(path, "utf8") || def;
  } catch (e) {
    return def;
  }
}

function stringifyAndSort(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort(), 2) + "\n";
}

function main() {
  const defaultLocaleFileContents = readFileOrDefault(defaultLocalePath, "{}");
  const defaultLocale = JSON.parse(defaultLocaleFileContents);
  const newLocale = {};

  const messageFiles = glob.sync(messageFilesPath + "/**/*.json", { absolute: true });

  messageFiles.forEach(path => {
    const messages = JSON.parse(readFileOrDefault(path, "{}"));

    const extractedIds = messages.map(m => m.id);

    // add new ids to default locale file
    for (const id of extractedIds) {
      newLocale[id] = defaultLocale[id] || "";
    }
  });

  writeFileSync(defaultLocalePath, stringifyAndSort(newLocale));
  console.log(`File ${defaultLocalePath} saved...`);
  console.log("Extracted translations: ", Object.keys(newLocale).length);
}

main();
