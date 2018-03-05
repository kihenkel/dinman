const logger = require('./logger');
const logs = require('./logs');
const repository = require('./repository');
const processes = require('./processes');
const groups = require('./groups');

const ParamType = {
  group: 'group',
  app: 'app',
};

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

const start = async (appName) => {
  processes.startApp(appName);
};

const restart = async (appName) => {
  await processes.restartApp(appName);
};

const stop = (appName) => {
  processes.stopApp(appName);
};

const stopAll = () => {
  processes.stopAll();
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
  ls: { expects: undefined, exec: ls },
  'ls-groups': { expects: ParamType.group, exec: lsGroups },
  start: { expects: ParamType.app, exec: start },
  restart: { expects: ParamType.app, exec: restart },
  stop: { expects: ParamType.app, exec: stop },
  'stop-all': { expects: undefined, exec: stopAll },
  log: { expects: ParamType.app, exec: log },
  'start-group': { expects: ParamType.group, exec: startGroup },
  'stop-group': { expects: ParamType.group, exec: stopGroup },
  exit: { expects: undefined, exec: exit },
  quit: { expects: undefined, exec: exit },
};

const commandDescription = {
  log: 'Output log for app',
  ls: 'List all apps from config',
  'ls-groups': 'List all groups from config',
  start: 'Start app',
  restart: 'Restart app',
  stop: 'Stop app',
  'stop-all': 'Stop all apps',
  'start-group': 'Start group',
  'stop-group': 'Stop group',
};

const hiddenCommands = ['help', 'exit', 'quit'];

const help = () => {
  logger.info(`The following commands are available:`);
  Object.keys(commands).forEach(key => {
    if (!hiddenCommands.includes(key)) {
      let line = ` ${key}`;
      const command = commands[key];
      if (command.expects) {
        line += ` [${command.expects}]`;
      }
      for (let i = line.length; i < 32; i++) { line += ' ' }
      line += ` ${commandDescription[key] || ''}`;

      logger.info(line);
    }
  });
};

commands['help'] = { expects: undefined, exec: help };

module.exports = {
  run: async (command, ...args) => {
    if (commands[command]) {
      await commands[command].exec(...args);
      return true;
    }
    console.log(`Unknown command ${command}`);
    return false;
  },
  commands,
  ParamType,
};