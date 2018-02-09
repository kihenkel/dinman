const logs = require('./logs');
const repository = require('./repository');
const processes = require('./processes');
const { groups } = require('./config');

const log = (app) => {
  logs.showLog(app);
};

const ls = () => {
  repository.getAppNames().forEach(appName => {
    const status = processes.isAppRunning(appName) ? 'Running': 'Stopped'
    console.log(`${appName}: ${status}`);
  });
};

const lsGroups = () => {
  Object.keys(groups).forEach(group => {
    console.log(` ${group}`);
  });
};

const start = (appName) => {
  processes.startApp(appName);
};

const stop = (appName) => {
  processes.stopApp(appName);
};

const startGroup = (groupName) => {
  if (!groups[groupName]) {
    console.log(`Group ${groupName} not found.`)
    return;
  }

  groups[groupName].forEach(appName => processes.startApp(appName));
};

const stopGroup = (groupName) => {
  if (!groups[groupName]) {
    console.log(`Group ${groupName} not found.`)
    return;
  }

  groups[groupName].forEach(appName => processes.stopApp(appName));
};

const commands = {
  log,
  ls,
  'ls-groups': lsGroups,
  start,
  stop,
  'start-group': startGroup,
  'stop-group': stopGroup,
};

const help = () => {
  console.log(`The following commands are available:`);
  Object.keys(commands).forEach(key => {
    if (key !== 'help') {
      console.log(` ${key}`);
    }
  });
};

commands['help'] = help;

module.exports = {
  run: (command, ...args) => {
    if (commands[command]) {
      commands[command](...args);
      return true;
    }
    console.log(`Unknown command ${command}`);
    return false;
  }
};