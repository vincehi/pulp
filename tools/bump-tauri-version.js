import fs from "fs";
import path from "path";
import { DIRNAME } from "./constants.js";

const filePath = path.resolve(DIRNAME, "../src-tauri/tauri.conf.json");
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Version argument is required");
  process.exit(1);
}

// Lire le contenu du fichier tauri.conf.json
const fileContent = fs.readFileSync(filePath, "utf8");
const config = JSON.parse(fileContent);
const currentVersion = config.package.version;

// Fonction pour comparer les versions
function isVersionGreater(newVer, currentVer) {
  const newParts = newVer.split(".").map(Number);
  const currentParts = currentVer.split(".").map(Number);

  for (let i = 0; i < newParts.length; i++) {
    if (newParts[i] > currentParts[i]) return true;
    if (newParts[i] < currentParts[i]) return false;
  }
  return false;
}

if (!isVersionGreater(newVersion, currentVersion)) {
  console.error("New version must be greater than the current version");
  process.exit(1);
}

const updatedContent = fileContent.replace(
  /"version": "\d+\.\d+\.\d+"/,
  `"version": "${newVersion}"`
);

fs.writeFileSync(filePath, updatedContent, "utf8");
console.log(`Version updated to ${newVersion}`);
