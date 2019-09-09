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

const loadProfileConfig = () => {
  let mainConfig;
  try {
    require.resolve('./../profile.json');
    mainConfig = require('./../profile.json');
  } catch (error) {
    mainConfig = {};
  }
  return mainConfig;
};

const initConfig = () => {
  const mainConfig = loadMainConfig();
  const dependencyConfig = loadDependencyConfig();
  const startProfileConfig = loadProfileConfig();
  config = Object.assign({}, mainConfig, dependencyConfig, startProfileConfig);
};

initConfig();

module.exports = {
  getConfig: () => config,
  reloadConfig: () => {
    let mainConfigPath;
    let dependencyConfigPath;
    let profileConfigPath;
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
    try {
      profileConfigPath = require.resolve('./../profile.json');
    } catch (error) {
      profileConfigPath = undefined;
    }
    delete require.cache[mainConfigPath];
    delete require.cache[dependencyConfigPath];
    delete require.cache[profileConfigPath];
    initConfig();
  },
};
