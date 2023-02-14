module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['solid'],
  extends: ['standard-with-typescript', 'plugin:solid/typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  rules: {},
};
