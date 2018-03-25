/* eslint-disable global-require, import/no-unresolved */

let config;
try {
  require.resolve('./../config.json');
  config = require('./../config.json');
} catch (error) {
  config = {};
}

let dependencyConfig;
try {
  require.resolve('./../dependencyConfig.json');
  dependencyConfig = require('./../dependencyConfig.json');
} catch (error) {
  dependencyConfig = {};
}

config = Object.assign({}, config, dependencyConfig);

module.exports = config;
