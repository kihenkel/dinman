/* eslint-disable global-require, import/no-unresolved */
let config;

const loadMainConfig = () => {
  let mainConfig;
  try {
    require.resolve('./../config.json');
    mainConfig = require('./../config.json');
  } catch (error) {
    mainConfig = {};
  }
  return mainConfig;
};

const loadDependencyConfig = () => {
  let dependencyConfig;
  try {
    require.resolve('./../dependencyConfig.json');
    dependencyConfig = require('./../dependencyConfig.json');
  } catch (error) {
    dependencyConfig = {};
  }
  return dependencyConfig;
};

const initConfig = () => {
  const mainConfig = loadMainConfig();
  const dependencyConfig = loadDependencyConfig();
  config = Object.assign({}, mainConfig, dependencyConfig);
};

initConfig();

module.exports = {
  getConfig: () => config,
  reloadConfig: () => {
    let mainConfigPath;
    let dependencyConfigPath;
    try {
      mainConfigPath = require.resolve('./../config.json');
    } catch (error) {
      mainConfigPath = undefined;
    }
    try {
      dependencyConfigPath = require.resolve('./../dependencyConfig.json');
    } catch (error) {
      dependencyConfigPath = undefined;
    }
    delete require.cache[mainConfigPath];
    delete require.cache[dependencyConfigPath];
    initConfig();
  },
};
