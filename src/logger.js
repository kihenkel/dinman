const LogLevel = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  verbose: 'verbose',
};

let logLevel = LogLevel.info; // verbose, info, warning, error

const Color = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const log = (...msg) => {
  process.stdout.write(` ${msg.join(' ')}\n`);
};

const asColor = (msg, color) =>
  `${color}${msg}${Color.white}`;

const error = (...msg) => {
  log(`[${asColor('ERROR', Color.red)}]`, ...msg);
};

const warning = (...msg) => {
  if ([LogLevel.verbose, LogLevel.info, LogLevel.warning].includes(logLevel)) {
    log(`[${asColor('Warning', Color.yellow)}]`, ...msg);
  }
};

const info = (...msg) => {
  if ([LogLevel.verbose, LogLevel.info].includes(logLevel)) {
    log(...msg);
  }
};

const verbose = (...msg) => {
  if ([LogLevel.verbose].includes(logLevel)) {
    log(...msg);
  }
};

const positive = (tag, ...msg) => {
  log(`[${asColor(tag, Color.green)}]`, ...msg);
};

const negative = (tag, ...msg) => {
  log(`[${asColor(tag, Color.red)}]`, ...msg);
};

const clearConsole = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

const newLine = () => {
  process.stdout.write('\n');
};

const setLogLevel = (newLogLevel) => {
  if (!Object.values(LogLevel).includes(newLogLevel)) {
    error(`Log level ${newLogLevel} doesnt exist.`);
    return;
  }

  log(`Setting log level to ${newLogLevel} ...`);
  logLevel = newLogLevel;
};

module.exports = {
  asColor,
  error,
  warning,
  info,
  verbose,
  positive,
  negative,
  clearConsole,
  newLine,
  setLogLevel,
  Color,
};
