const core = require('@actions/core');

function verifyConditions() {
  core.setOutput("next-release-published", "false");
}

function generateNotes(_pluginConfig, {nextRelease}) {
  core.setOutput("next-release-published", "true");
  core.setOutput("next-release", nextRelease);
}

module.exports = {
  verifyConditions,
  generateNotes,
};
