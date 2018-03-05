const Color = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  white: '\x1b[37m',
};

const _log = (msg) => {
  process.stdout.write(` ${msg}\n`);
};

const _withColoredTag = (tag, color, msg) => {
  _log(`[${color}${tag}${Color.white}] ${msg}`);
};

const error = (msg) => {
  _withColoredTag('ERROR', Color.red, msg);
};

const warning = (msg) => {
  _withColoredTag('Warning', Color.yellow, msg);
};

const info = (msg) => {
  _log(msg);
};

const positive = (tag, msg) => {
  _withColoredTag(tag, Color.green, msg);
};

const negative = (tag, msg) => {
  _withColoredTag(tag, Color.red, msg);
};

const clearConsole = () => {
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

const newLine = () => {
  process.stdout.write('\n');
}

module.exports = {
  error,
  warning,
  info,
  positive,
  negative,
  clearConsole,
  newLine,
};