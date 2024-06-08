module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    jest: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "no-console": "off",
    "consistent-return": "off", 
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }], 
    "import/extensions": ["error", "ignorePackages", { "js": "never" }], 
    // "import/order": ["error", { "newlines-between": "always" }] 
  },
};