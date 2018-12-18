const childProcess = require('child_process');
const logger = require('./logger');
const repository = require('./repository');
const input = require('./input');

const sanitizeCommand = (command) => {
  let sanitizedCommand = command;
  if (/'|"/g.test(sanitizedCommand[0]) &&
   /'|"/g.test(sanitizedCommand[sanitizedCommand.length - 1])) {
    sanitizedCommand = sanitizedCommand.slice(1, sanitizedCommand.length - 1);
  }
  return sanitizedCommand;
};

const cmd = (appName, command) => {
  if (!appName || !command) {
    logger.info('Please provide app and command.');
    return;
  }

  const sanitizedCommand = sanitizeCommand(command);
  const app = repository.getAppByName(appName);

  if (!app) {
    logger.info(`App ${appName} not found.`);
    return;
  }

  logger.info(`Executing command '${sanitizedCommand}' in working dir ${app.path}. USE AT OWN RISK!`);
  childProcess.exec(sanitizedCommand, { cwd: app.path }, (error, stdout, stderr) => {
    logger.newLine();
    if (error) {
      logger.error(`Error while executing command ${command} in working dir ${app.path}`);
      logger.info(error);
    }

    if (stderr) {
      logger.info(`${appName}:`, stderr);
    }

    if (stdout) {
      logger.info(`${appName}:`, stdout);
    }
    logger.info(`${appName}: Execution of command ${command} ended.`);
    input.prompt();
  });
};

const cmdAll = (command) => {
  if (!command) {
    logger.info('Please provide command.');
    return;
  }

  const apps = repository.getApps();
  if (!apps.length) {
    logger.info('No apps found. Command not executed.');
    return;
  }

  apps.forEach((app) => {
    cmd(app.name, command);
  });
};

module.exports = {
  cmd,
  cmdAll,
  sanitizeCommand,
};
