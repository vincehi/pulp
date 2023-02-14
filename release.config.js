// const semanticReleaseExportData = require("./tools/semantic-release-export-data")

const config = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github',
    ["@semantic-release/npm", {"npmPublish": false}],
    "./tools/semantic-release-export-data.js",
    // ["@semantic-release/git", {
    //   "assets": ["dist/*.js", "dist/*.js.map"],
    //   "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    // }],
    //
  ]
};

// console.log(process.env)


module.exports = config;
