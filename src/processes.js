const { spawn } = require('child_process');
const logs = require('./logs');
const repository = require('./repository');
const logger = require('./logger');
const defaults = require('./defaults');

const activeProcesses = {};
let input;

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
    if (!input) input = require('./input');
    input.prompt();
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

const stopApp = (appName, { silentOnFail = false } = {}) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    if (!silentOnFail) logger.info(`App ${appName} not found.`);
    logger.info(`App ${appName} not found.`);
    return false;
  }

  if (!activeProcesses[app.name]) {
    if (!silentOnFail) logger.info(`App ${app.name} is not running.`);
    return false;
  }

  logger.info(`Stopping ${app.name} ...`);
  activeProcesses[app.name].kill('SIGTERM');
  return true;
};

const stopAll = () => {
  logger.info(`Stopping all apps ...`);
  Object.keys(activeProcesses).forEach(key => {
    stopApp(key, { silent: true });
  })
};

const restartApp = (appName) => {
  return new Promise((resolve, reject) => {
    const app = repository.getAppByName(appName);
    if (!app) {
      logger.info(`App ${appName} not found.`);
      return resolve();
    }

    if (!activeProcesses[app.name]) {
      logger.info(`App ${app.name} is not running.`);
      return resolve();
    }

    logger.info(`Restarting ${app.name} ...`);

    activeProcesses[app.name].on('exit', () => {
      delete activeProcesses[app.name];
      startApp(appName);
      resolve();
    });

    stopApp(appName);
  });
};

const isAppRunning = (appName) => !!activeProcesses[appName];

module.exports = {
  startApp,
  stopApp,
  stopAll,
  restartApp,
  isAppRunning,
};