const config = require('./config');
const logger = require('./logger');
const processes = require('./processes');

const { groups } = config;

const listGroups = () => {
  if (!groups) {
    logger.info('No groups found.');
    return;
  }

  Object.keys(groups).forEach((group) => {
    logger.info(` ${group}`);
  });
};

const startGroup = (groupName) => {
  if (!groups || !groups[groupName]) {
    logger.info(`Group ${groupName} not found.`);
    return;
  }

  groups[groupName].forEach(appName => processes.startApp(appName));
};

const stopGroup = (groupName) => {
  if (!groups || !groups[groupName]) {
    logger.info(`Group ${groupName} not found.`);
    return;
  }

  groups[groupName].forEach(appName => processes.stopApp(appName));
};

const getAppsByGroupName = (groupName) => {
  if (!groups || !groups[groupName]) {
    logger.info(`Group ${groupName} not found.`);
    return [];
  }

  return groups[groupName] || [];
};

module.exports = {
  listGroups,
  startGroup,
  stopGroup,
  getAppsByGroupName,
};
