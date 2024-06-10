/**
 * @type {import('semantic-release').GlobalConfig}
 */

export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/vincehi/pulp.git", // Remplacez par l'URL de votre dépôt
  tagFormat: "v${version}", // Format de tag personnalisable
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    ["@semantic-release/npm", { npmPublish: false }],
    "./tools/semantic-release-export-data.js",
  ],
};
