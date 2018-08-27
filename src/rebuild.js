const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

const { getConfig, reloadConfig } = require('./config');
const logger = require('./logger');
const input = require('./input');
const repository = require('./repository');

module.exports = () => new Promise((resolve) => {
  const { buildPaths } = getConfig();

  if (!buildPaths || !buildPaths.length) {
    logger.error('No build paths found! Cannot rebuild config.');
    resolve();
    return;
  }

  const configBuilderPath = path.normalize('./configBuilder/index.js');

  try {
    fs.statSync(configBuilderPath);
  } catch (error) {
    logger.info(`${configBuilderPath} doesn't exist.`);
    resolve();
    return;
  }

  input.pause();
  logger.info('Rebuilding config ...');
  buildPaths.forEach(buildPath => logger.info(`Using path ${buildPath} ...`));

  let configBuilder;
  try {
    configBuilder = childProcess.fork(configBuilderPath, buildPaths);
  } catch (error) {
    logger.error(`Error while forking configBuilder process: ${error.toString()}`);
    input.resume();
    resolve();
    return;
  }

  configBuilder.on('message', (msg) => {
    if (!msg || !msg.result) {
      logger.error(`Unrecognized message ${JSON.stringify(msg)}`);
      return;
    }

    if (msg.result === 'OK') {
      logger.info('Successfully rebuilt config!');
    } else {
      logger.error('Something went wrong, rebuilding config was not successful.');
    }

    reloadConfig();
    repository.reload();
    input.resume();
    resolve();
  });
});
