const core = require('@actions/core');

function verifyConditions() {
  core.setOutput("next-release-published", "false");
}

function generateNotes(_pluginConfig, {nextRelease}) {
  core.setOutput("next-release-published", "true");
  core.setOutput("next-release-version", nextRelease.version);
  core.setOutput("next-release-git-tag", nextRelease.gitTag);
  core.setOutput("next-release-notes", nextRelease.notes);
}

module.exports = {
  verifyConditions,
  generateNotes,
};
