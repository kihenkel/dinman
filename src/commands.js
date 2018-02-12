const logger = require('./logger');
const logs = require('./logs');
const repository = require('./repository');
const processes = require('./processes');
const groups = require('./groups');

const log = (app) => {
  logs.showLog(app);
};

const ls = () => {
  repository.getAppNames().forEach(appName => {
    processes.isAppRunning(appName) ? 
      logger.positive('Running', appName) : logger.negative('Stopped', appName);
  });
};

const lsGroups = () => {
  groups.listGroups();
};

const start = (appName) => {
  processes.startApp(appName);
};

const stop = (appName) => {
  processes.stopApp(appName);
};

const startGroup = (groupName) => {
  groups.startGroup(groupName);
};

const stopGroup = (groupName) => {
  groups.stopGroup(groupName);
};

const exit = () => {
  logger.info('Bye!');
  process.exit(0);
};

const commands = {
  ls,
  'ls-groups': lsGroups,
  start,
  stop,
  log,
  'start-group': startGroup,
  'stop-group': stopGroup,
  exit,
  quit: exit,
};

const commandDescription = {
  log: '[app] \t\t\tOutput log for app',
  ls: '\t\t\t\tList all apps from config',
  'ls-groups': '\t\t\tList all groups from config',
  start: '[app] \t\t\tStart app',
  stop: '[app] \t\t\tStop app',
  'start-group': '[group] \t\tStart group',
  'stop-group': '[group] \t\tStop group',
};

const hiddenCommands = ['help', 'exit', 'quit'];

const help = () => {
  logger.info(`The following commands are available:`);
  Object.keys(commands).forEach(key => {
    if (!hiddenCommands.includes(key)) {
      logger.info(` ${key} ${commandDescription[key] || ''}`);
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