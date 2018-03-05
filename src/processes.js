const { spawn } = require('child_process');
const logs = require('./logs');
const repository = require('./repository');
const logger = require('./logger');
const defaults = require('./defaults');

const activeProcesses = {};

const startApp = (appName) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    logger.info(`App ${appName} not found.`);
    return false;
  }

  if (activeProcesses[app.name]) {
    logger.info(`App ${app.name} is already running!`);
    return false;
  }

  const childProcess = spawn(`node`, [app.entry || defaults.PROJECT_ENTRY], { cwd: app.path });
  logger.info(`Starting ${app.name} ...`);
  app.running = true;

  childProcess.stdout.on('data', (data) => {
    logs.onData(app.name, data);
  });

  childProcess.stderr.on('data', (data) => {
    logger.error(`${app.name}: ${data}`);
  });

  childProcess.on('error', (error) => {
    logger.error(error);
  });

  childProcess.on('exit', () => {
    delete activeProcesses[app.name];
  });

  activeProcesses[app.name] = childProcess;

  return childProcess;
};

const stopApp = (appName) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    logger.info(`App ${appName} not found.`);
    return false;
  }

  if (!activeProcesses[app.name]) {
    logger.info(`App ${app.name} is not running.`);
    return false;
  }

  logger.info(`Stopping ${app.name} ...`);
  activeProcesses[app.name].kill('SIGTERM');
  return true;
};

const restartApp = (appName) => {
  return new Promise((resolve, reject) => {
    const app = repository.getAppByName(appName);
    if (!app) {
      logger.info(`App ${appName} not found.`);
      return reject();
    }

    if (!activeProcesses[app.name]) {
      logger.info(`App ${app.name} is not running.`);
      return reject();
    }

    logger.info(`Restarting ${app.name} ...`);

    activeProcesses[app.name].on('exit', () => {
      delete activeProcesses[app.name];
      startApp(appName);
      resolve();
    });

    const stopSuccessful = stopApp(appName);
    if (!stopSuccessful) {
      reject();
    }
  });
};

const isAppRunning = (appName) => !!activeProcesses[appName];

module.exports = {
  startApp,
  stopApp,
  restartApp,
  isAppRunning,
};