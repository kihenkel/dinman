const logger = require('./logger');

const logs = {};
const MAX_LOG_SIZE_IN_BYTES = 1e+6; // 1 MB
const START_CUT_OFF_PERCENTAGE = 0.5;

const handleOnData = (appName, data) => {
  if (!logs[appName]) {
    logs[appName] = '';
  }
  logs[appName] += data;

  if (Buffer.byteLength(logs[appName], 'utf8') > MAX_LOG_SIZE_IN_BYTES) {
    logger.warning(`${appName} log hit maximum size, reducing by ${START_CUT_OFF_PERCENTAGE * 100}% ...`);
    logs[appName] = logs[appName]
      .slice(Math.round(START_CUT_OFF_PERCENTAGE * logs[appName].length));
  }
};

const clearAppLogs = (appName) => {
  logs[appName] = '';
};

const showLog = (appName) => {
  if (!logs[appName]) {
    logger.info(`No logs found for ${appName}.`);
    return false;
  }
  logger.clearConsole();
  logger.info(logs[appName]);
  return true;
};

module.exports = {
  onData: handleOnData,
  clearAppLogs,
  showLog,
};
