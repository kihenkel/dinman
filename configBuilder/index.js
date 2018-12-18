// Config builder needs paths containing repositories
// Run with path params, eg.:
// npm run buildconfig -- "C:\source\veve\apps" "C:\source\veve\services"

const fs = require('fs');
const path = require('path');
const defaults = require('./../src/defaults');
const stripJsonComments = require('./strip-json-comments');
const logger = require('./../src/logger');
const registerDependenciesForConfig = require('./registerDependenciesForConfig');
const extractEntryFromStartScript = require('./extractEntryFromStartScript');
const generateJsonFromConfig = require('./generateJsonFromConfig');
const communication = require('./communication');

const detectedApps = [];

const registerApp = (folder) => {
  const packageJsonPath = path.join(folder, 'package.json');
  try {
    fs.statSync(packageJsonPath);
  } catch (error) {
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

  const entry = packageJson.main ||
    extractEntryFromStartScript(packageJson.scripts) ||
    defaults.PROJECT_ENTRY;

  const entryPath = path.join(folder, entry);
  try {
    fs.statSync(entryPath);
  } catch (error) {
    logger.error(`Can't find entry file ${entryPath}. Skipping this app ...`);
    return;
  }

  const port = packageJson.config && parseInt(packageJson.config.port, 10);
  if (!port) {
    logger.info(`Couldn't find port in ${packageJsonPath}. Dependencies unavailable for this app!`);
  }

  if (packageJson.name && !detectedApps.includes(packageJson.name)) {
    logger.info(`Detected app ${packageJson.name}${port ? ` with port ${port}` : ''}.`);

    detectedApps.push({
      name: packageJson.name,
      port,
      path: folder,
      dependencies: [],
      entry: entryPath,
    });
  }
};

const readConfigFromFolder = (app) => {
  const defaultJsonPath = path.join(app.path, 'config', 'default.json');
  try {
    fs.statSync(defaultJsonPath);
  } catch (error) {
    logger.info(`${defaultJsonPath} doesn't exist.`);
    return;
  }

  let configRaw = fs.readFileSync(defaultJsonPath, 'utf8');
  configRaw = stripJsonComments(configRaw);
  let config;
  try {
    config = JSON.parse(configRaw);
  } catch (error) {
    logger.error(`Can't parse file ${defaultJsonPath}. Error: ${error}`);
    logger.error(`Skipping app ${app.name}!`);
    return;
  }

  if (!config) {
    logger.error(`Config doesnt exist for ${app.name}, skip looking for dependencies ...`);
    return;
  }

  registerDependenciesForConfig(config, app, detectedApps);
};

const args = process.argv.slice(2);
let paths = args;

const verboseParam = '--verbose';
if (args.includes(verboseParam)) {
  logger.setLogLevel('verbose');
  paths = args.filter(arg => arg !== verboseParam);
}

if (paths.length <= 0) {
  logger.error('No paths provided, configBuilder needs paths. Check configBuilder.js how to provide them.');
  process.exit(0);
} else {
  paths.forEach((paramPath) => {
    let allFiles;
    try {
      allFiles = fs.readdirSync(paramPath).map(file => path.join(paramPath, file));
    } catch (error) {
      logger.error(error);
      logger.error(`Skipping path ${paramPath} ...`);
      return;
    }

    const folders = allFiles.filter(file => fs.statSync(file).isDirectory());
    folders.forEach(registerApp);
  });

  detectedApps.forEach(readConfigFromFolder);

  const fileToWrite = 'config.json';
  fs.writeFileSync(fileToWrite, generateJsonFromConfig(detectedApps, paths), 'utf8');

  logger.newLine();
  logger.info('===================================');
  logger.info(`Done! Wrote to file ${fileToWrite}!`);

  communication.announceSuccess();
}
