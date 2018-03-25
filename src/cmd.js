const childProcess = require('child_process');
const logger = require('./logger');
const repository = require('./repository');
const groups = require('./groups');

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
  childProcess.exec(sanitizedCommand, { cwd: app.path }, (error) => {
    if (error) {
      logger.error(`Error while executing command ${command} in working dir ${app.path}`);
      logger.error(error);
    }
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

const cmdGroup = (groupName, command) => {
  if (!groupName || !command) {
    logger.info('Please provide group and command.');
    return;
  }

  const appNames = groups.getAppsByGroupName(groupName);
  if (!appNames.length) {
    logger.info(`No apps found for group ${groupName}. Command not executed.`);
    return;
  }

  appNames.forEach((appName) => {
    cmd(appName, command);
  });
};

module.exports = {
  cmd,
  cmdAll,
  cmdGroup,
  sanitizeCommand,
};
