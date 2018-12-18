const logger = require('./logger');
const logs = require('./logs');
const repository = require('./repository');
const dependencies = require('./dependencies');
const processes = require('./processes');
const rebuild = require('./rebuild');
const { cmd, cmdAll } = require('./cmd');

const ParamType = {
  app: 'app',
  command: 'command',
};

const log = (app) => {
  logs.showLog(app);
};

const ls = () => {
  const apps = repository.getApps();
  if (!apps.length) {
    logger.info('No apps registered.');
    return;
  }

  apps.forEach((app) => {
    const appName = app.name;
    const suffix = app.port && logger.asColor(`(at port ${app.port})`, logger.Color.gray);
    if (processes.isAppRunning(appName)) {
      logger.positive('Running', appName, suffix);
    } else {
      logger.negative('Stopped', appName, suffix);
    }
  });
};

const start = (appName) => {
  dependencies.startApp(appName);
};

const startExcluded = (appName) => {
  dependencies.startAppExcluded(appName);
};

const startOnly = (appName) => {
  processes.startApp(appName);
};

const startAll = () => {
  const appNames = repository.getAppNames();
  if (!appNames.length) {
    logger.info('No apps registered.');
    return;
  }

  appNames.forEach((appName) => {
    processes.startApp(appName);
  });
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

const clear = () => {
  logger.clearConsole();
};

const exit = () => {
  logger.info('Bye!');
  process.exit(0);
};

const commands = {
  ls: { expects: [], exec: ls },
  start: { expects: [ParamType.app], exec: start },
  'start-excluded': { expects: [ParamType.app], exec: startExcluded },
  'start-only': { expects: [ParamType.app], exec: startOnly },
  'start-all': { expects: [], exec: startAll },
  restart: { expects: [ParamType.app], exec: restart },
  stop: { expects: [ParamType.app], exec: stop },
  'stop-all': { expects: [], exec: stopAll },
  log: { expects: [ParamType.app], exec: log },
  cmd: { expects: [ParamType.app, ParamType.command], exec: cmd },
  'cmd-all': { expects: [ParamType.command], exec: cmdAll },
  rebuild: { expects: [], exec: rebuild },
  clear: { expects: [], exec: clear },
  cls: { expects: [], exec: clear },
  exit: { expects: [], exec: exit },
  quit: { expects: [], exec: exit },
};

const commandDescription = {
  log: 'Outputs log for app',
  ls: 'Lists all apps from config',
  start: 'Starts app with dependencies',
  'start-excluded': 'Starts apps dependencies but not app itself',
  'start-only': 'Starts app only (without dependencies)',
  'start-all': 'Starts all apps',
  restart: 'Restarts app',
  stop: 'Stops app',
  'stop-all': 'Stops all apps',
  rebuild: 'Rebuilds dinman config',
  cmd: 'Executes command in app working directory',
  'cmd-all': 'Executes command in working directories of all apps',
};

const hiddenCommands = ['help', 'exit', 'quit', 'cls', 'clear'];

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
