// Config builder needs paths containing repositories
// Run with path params, eg.:
// npm run buildconfig -- "C:\source\veve\apps" "C:\source\veve\services"

const fs = require('fs');
const path = require('path');
const logger = require('./../src/logger');
const sanitizeJson = require('./sanitizeJson');

const detectedApps = [];

const paths = process.argv.slice(2);
if (paths.length <= 0) {
  logger.error('No paths provided, configBuilder needs paths. Check configBuilder.js how to provide them.')
  return process.exit(0);
}

const registerAppName = (folder) => {
  const packageJsonPath = path.join(folder, 'package.json');
  const packageJsonExists = fs.statSync(packageJsonPath);
  if (!packageJsonExists) {
    logger.info(`${packageJsonPath} doesn't exist.`);
    return;
  }
  const packageJsonRaw = fs.readFileSync(packageJsonPath, 'utf8');
  let packageJson;
  try {
    packageJson = JSON.parse(packageJsonRaw);
  } catch (error) {
    logger.error(`Can't parse file ${packageJsonPath}. Error: ${error}`);
    return;
  }
  if (packageJson.name && !detectedApps.includes(packageJson.name)) {
    logger.info(`Detected app ${packageJson.name}`);
    detectedApps.push({ name: packageJson.name, path: folder, dependencies: [] });
  }
};

const tryParseDependency = (app, api) => {
  const formatted = api.replace(/([A-Z])/g, '-$1').toLowerCase();
  const trimmed = formatted.replace('-url', '');
  if (!trimmed.endsWith('-service')) {
    logger.warning(`${trimmed} doesnt end with service`);
  }

  const matching = detectedApps.filter(detectedApp => 
    detectedApp.name.match(new RegExp(`^(vc-|veve-|c24-)${trimmed}(-|$)`, 'g'))
  );
  if (matching && matching.length > 0) {
    logger.info(`Dependencies found for ${app.name}: ${matching.map(match => match.name)}`);
    app.dependencies.push()
  }
};

const readConfigFromFolder = (app) => {
  const defaultJsonPath = path.join(app.path, 'config', 'default.json');
  const configExists = fs.statSync(defaultJsonPath);
  if (!configExists) {
    logger.info(`${defaultJsonPath} doesn't exist.`);
    return;
  }
  const configRaw = fs.readFileSync(defaultJsonPath, 'utf8');
  let config;
  try {
    config = JSON.parse(configRaw);
  } catch (error) {
    logger.error(`Can't parse file ${defaultJsonPath}. Error: ${error}`);
    return;
  }

  if (!config) {
    logger.error(`Config doesnt exist for ${app.name}, skip looking for dependencies ...`);
    return;
  }

  if (config.api) {
    const configKeys = Object.keys(config.api);
    configKeys.forEach(key => tryParseDependency(app, key));
  }

  const configKeys = Object.keys(config);
  configKeys.forEach(key => tryParseDependency(app, key));
};

paths.forEach(paramPath => {
  const allFiles = fs.readdirSync(paramPath).map(file => path.join(paramPath, file));
  const folders = allFiles.filter(file => fs.statSync(file).isDirectory());
  folders.forEach(registerAppName);
});

detectedApps.forEach(readConfigFromFolder);