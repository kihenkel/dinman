let logLevel = 'info'; // verbose, info, warning, error

const Color = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  white: '\x1b[37m',
};

const log = (msg) => {
  process.stdout.write(` ${msg}\n`);
};

const withColoredTag = (tag, color, msg) => {
  log(`[${color}${tag}${Color.white}] ${msg}`);
};

const error = (msg) => {
  withColoredTag('ERROR', Color.red, msg);
};

const warning = (msg) => {
  if (['verbose', 'info', 'warning'].includes(logLevel)) {
    withColoredTag('Warning', Color.yellow, msg);
  }
};

const info = (msg) => {
  if (['verbose', 'info'].includes(logLevel)) {
    log(msg);
  }
};

const verbose = (msg) => {
  if (['verbose'].includes(logLevel)) {
    log(msg);
  }
};

const positive = (tag, msg) => {
  withColoredTag(tag, Color.green, msg);
};

const negative = (tag, msg) => {
  withColoredTag(tag, Color.red, msg);
};

const clearConsole = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

const newLine = () => {
  process.stdout.write('\n');
};

const setLogLevel = (newLogLevel) => {
  if (!['verbose', 'info', 'warning', 'error'].includes(newLogLevel)) {
    error(`Log level ${newLogLevel} doesnt exist.`);
    return;
  }
  
  log(`Setting log level to ${newLogLevel} ...`);
  logLevel = newLogLevel;
};

module.exports = {
  error,
  warning,
  info,
  verbose,
  positive,
  negative,
  clearConsole,
  newLine,
  setLogLevel,
};
