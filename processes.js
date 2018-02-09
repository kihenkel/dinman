const { spawn } = require('child_process');
const logs = require('./logs');
const repository = require('./repository');

const activeApps = {};

const startApp = (appName) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    console.log(`App ${appName} not found.`);
    return false;
  }

  if (activeApps[app.name]) {
    console.log(`App ${app.name} is already running!`);
    return false;
  }

  const childProcess = spawn(`node`, [app.main], { cwd: app.path, shell: true });
  console.log(`Starting ${app.name} ...`);
  app.running = true;

  childProcess.stdout.on('data', (data) => {
    logs.onData(app.name, data);
  });

  activeApps[app.name] = childProcess;

  return childProcess;
};

const stopApp = (appName) => {
  const app = repository.getAppByName(appName);
  if (!app) {
    console.log(`App ${appName} not found.`);
    return false;
  }

  if (!activeApps[app.name]) {
    console.log(`App ${app.name} is not running.`);
    return false;
  }

  console.log(`Stopping ${app.name} ...`);
  activeApps[app.name].kill('SIGINT');
  delete activeApps[app.name];
  return true;
};

const isAppRunning = (appName) => !!activeApps[appName];

module.exports = {
  startApp,
  stopApp,
  isAppRunning,
};