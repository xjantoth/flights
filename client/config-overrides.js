/* config-overrides.js */
const rewireSass = require("react-app-rewire-scss");

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config = rewireSass(config, env);
  return config;
};
