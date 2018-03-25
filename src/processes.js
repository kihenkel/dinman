const childProcess = require('child_process');
const logs = require('./logs');
const repository = require('./repository');
const logger = require('./logger');
const defaults = require('./defaults');

const activeProcesses = {};
let input;

const handleOnChildProcessExit = (appName) => {
  delete activeProcesses[appName];
  logs.onAppExit(appName);
};

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

  const process = childProcess.spawn('node', [app.entry || defaults.PROJECT_ENTRY], { cwd: app.path });
  logger.info(`Starting ${app.name} ...`);

  process.stdout.on('data', (data) => {
    logs.onData(app.name, data);
  });

  process.stderr.on('data', (data) => {
    logger.error(`${app.name}: ${data}`);
    if (!input) input = require('./input'); // eslint-disable-line global-require
    input.prompt();
  });

  process.on('error', (error) => {
    logger.error(error);
  });

  process.on('exit', () => {
    handleOnChildProcessExit(app.name);
  });

  activeProcesses[app.name] = process;

  return process;
};

const stopApp = (appName, { silentOnFail = false } = {}) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    if (!silentOnFail) logger.info(`App ${appName} not found.`);
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
  logger.info('Stopping all apps ...');
  Object.keys(activeProcesses).forEach((key) => {
    stopApp(key, { silent: true });
  });
};

const restartApp = appName => new Promise((resolve) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    logger.info(`App ${appName} not found.`);
    resolve();
    return;
  }

  if (!activeProcesses[app.name]) {
    logger.info(`App ${app.name} is not running.`);
    resolve();
    return;
  }

  logger.info(`Restarting ${app.name} ...`);

  activeProcesses[app.name].on('exit', () => {
    handleOnChildProcessExit(app.name);
    startApp(appName);
    resolve();
  });

  stopApp(appName);
});

const isAppRunning = appName => !!activeProcesses[appName];

module.exports = {
  startApp,
  stopApp,
  stopAll,
  restartApp,
  isAppRunning,
};
