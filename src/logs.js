const logger = require('./logger');
const logs = {};

const handleOnData = (app, data) => {
  if (!logs[app]) {
    logs[app] = '';
  }
  logs[app] += data;
};

const showLog = (app) => {
  if (!logs[app]) {
    logger.info(`No logs found for ${app}.`);
    return false;
  }
  logger.clearConsole();
  logger.info(logs[app])
  return true;
};

module.exports = {
  onData: handleOnData,
  showLog,
};