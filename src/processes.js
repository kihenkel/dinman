const { spawn } = require('child_process');
const logs = require('./logs');
const repository = require('./repository');
const logger = require('./logger');
const defaults = require('./defaults');

const activeProcesses = {};

const startApp = (appName) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    console.log(`App ${appName} not found.`);
    return false;
  }

  if (activeProcesses[app.name]) {
    console.log(`App ${app.name} is already running!`);
    return false;
  }

  const childProcess = spawn(`node`, [app.entry || defaults.PROJECT_ENTRY], { cwd: app.path });
  console.log(`Starting ${app.name} ...`);
  app.running = true;

  childProcess.stdout.on('data', (data) => {
    logs.onData(app.name, data);
  });

  childProcess.stderr.on('data', (data) => {
    logger.error(data);
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
    console.log(`App ${appName} not found.`);
    return false;
  }

  if (!activeProcesses[app.name]) {
    console.log(`App ${app.name} is not running.`);
    return false;
  }

  console.log(`Stopping ${app.name} ...`);
  activeProcesses[app.name].kill('SIGTERM');
  return true;
};

const isAppRunning = (appName) => !!activeProcesses[appName];

module.exports = {
  startApp,
  stopApp,
  isAppRunning,
};