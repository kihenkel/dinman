const logger = require('./logger');
const logs = {};
const MAX_LOG_SIZE_IN_BYTES = 1e+6; // 1 mb
const STRING_LENGTH_THRESHOLD = MAX_LOG_SIZE_IN_BYTES / 2; // For log length check BEFORE byte size check, for performance reasons
const START_CUT_OFF_PERCENTAGE = 0.2; // Cut beginning of log by 10% if it's too big

const handleOnData = (appName, data) => {
  if (!logs[appName]) {
    logs[appName] = '';
  }
  logs[appName] += data;

  if (Buffer.byteLength(logs[appName], 'utf8') > MAX_LOG_SIZE_IN_BYTES) {
      logger.warning(`Log of ${appName} hit the maximum size, reducing length by ${START_CUT_OFF_PERCENTAGE * 100}% ...`);
      logs[appName] = logs[appName].slice(
        Math.round(START_CUT_OFF_PERCENTAGE * logs[appName].length)
      );
  }
};

const handleOnAppExit = (appName) => {
  logs[appName] = '';
};

const showLog = (appName) => {
  if (!logs[appName]) {
    logger.info(`No logs found for ${appName}.`);
    return false;
  }
  logger.clearConsole();
  logger.info(logs[appName])
  return true;
};

module.exports = {
  onData: handleOnData,
  onAppExit: handleOnAppExit,
  showLog,
};