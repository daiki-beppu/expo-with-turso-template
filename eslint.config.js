const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = [
  {
    ignores: ["dist/*", ".expo/**", "node_modules/**"],
  },
  ...expoConfig,
  eslintPluginPrettierRecommended,
];
