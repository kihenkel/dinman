const logger = require('./logger');
const logs = require('./logs');
const repository = require('./repository');
const dependencies = require('./dependencies');
const processes = require('./processes');
const groups = require('./groups');
const { cmd, cmdAll, cmdGroup } = require('./cmd');

const ParamType = {
  group: 'group',
  app: 'app',
  command: 'command',
};

const log = (app) => {
  logs.showLog(app);
};

const ls = () => {
  const appNames = repository.getAppNames();
  if (!appNames.length) {
    logger.info('No apps registered.');
    return;
  }

  appNames.sort().forEach((appName) => {
    if (processes.isAppRunning(appName)) {
      logger.positive('Running', appName);
    } else {
      logger.negative('Stopped', appName);
    }
  });
};

const lsGroups = () => {
  groups.listGroups();
};

const start = async (appName) => {
  dependencies.startApp(appName);
};

const restart = async (appName) => {
  try {
    await processes.restartApp(appName);
  } catch (error) {
    logger.error(`Error while restarting app ${appName}:`, error);
  }
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
  ls: { expects: [], exec: ls },
  'ls-groups': { expects: [], exec: lsGroups },
  start: { expects: [ParamType.app], exec: start },
  restart: { expects: [ParamType.app], exec: restart },
  stop: { expects: [ParamType.app], exec: stop },
  'stop-all': { expects: [], exec: stopAll },
  log: { expects: [ParamType.app], exec: log },
  'start-group': { expects: [ParamType.group], exec: startGroup },
  'stop-group': { expects: [ParamType.group], exec: stopGroup },
  cmd: { expects: [ParamType.app, ParamType.command], exec: cmd },
  'cmd-all': { expects: [ParamType.command], exec: cmdAll },
  'cmd-group': { expects: [ParamType.group, ParamType.command], exec: cmdGroup },
  exit: { expects: [], exec: exit },
  quit: { expects: [], exec: exit },
};

const commandDescription = {
  log: 'Outputs log for app',
  ls: 'Lists all apps from config',
  'ls-groups': 'Lists all groups from config',
  start: 'Starts app',
  restart: 'Restarts app',
  stop: 'Stops app',
  'stop-all': 'Stops all apps',
  'start-group': 'Starts group',
  'stop-group': 'Stops group',
  cmd: 'Executes command in app working directory',
  'cmd-all': 'Executes command in working directories of all apps',
  'cmd-group': 'Executes command in working directories of group',
};

const hiddenCommands = ['help', 'exit', 'quit'];

const help = () => {
  logger.newLine();
  logger.info('The following commands are available:');
  Object.keys(commands).forEach((key) => {
    if (!hiddenCommands.includes(key)) {
      let line = ` ${key}`;
      const command = commands[key];
      if (command.expects.length) {
        line += command.expects.reduce((acc, val) => `${acc} [${val}]`, '');
      }
      for (let i = line.length; i < 32; i += 1) { line += ' '; }
      line += ` ${commandDescription[key] || ''}`;

      logger.info(line);
    }
  });
};

commands.help = { expects: undefined, exec: help };

module.exports = {
  run: async (command, ...args) => {
    if (commands[command]) {
      await commands[command].exec(...args);
      return true;
    }
    logger.info(`Unknown command ${command}.`);
    return false;
  },
  commands,
  ParamType,
};
