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

const loadProfilConfig = () => {
  let mainConfig;
  try {
    require.resolve('./../startProfil.json');
    mainConfig = require('./../startProfil.json');
  } catch (error) {
    mainConfig = {};
  }
  return mainConfig;
};

const initConfig = () => {
  const mainConfig = loadMainConfig();
  const dependencyConfig = loadDependencyConfig();
  const startProfilConfig = loadProfilConfig();
  config = Object.assign({}, mainConfig, dependencyConfig, startProfilConfig);
};

initConfig();

module.exports = {
  getConfig: () => config,
  reloadConfig: () => {
    let mainConfigPath;
    let dependencyConfigPath;
    let profilConfigPath;
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
      profilConfigPath = require.resolve('./../startProfil.json');
    } catch (error) {
      profilConfigPath = undefined;
    }
    delete require.cache[mainConfigPath];
    delete require.cache[dependencyConfigPath];
    delete require.cache[profilConfigPath];
    initConfig();
  },
};
