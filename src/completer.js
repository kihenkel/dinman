const { commands, ParamType } = require('./commands');
const groups = require('./../config.json').groups || {}; // eslint-disable-line global-require

const groupNames = Object.keys(groups);
const appNames = require('./repository').getAppNames();

const commandNames = Object.keys(commands);
const appCommands = Object.entries(commands)
  .filter(entry => entry[1].expects &&
  entry[1].expects.length && entry[1].expects[0] === ParamType.app)
  .map(([key]) => key);
const groupCommands = Object.entries(commands)
  .filter(entry => entry[1].expects &&
    entry[1].expects.length && entry[1].expects[0] === ParamType.group)
  .map(([key]) => key);

const prefixCompletions = (completions, prefix) =>
  completions.map(completion => `${prefix} ${completion}`);

const getCompletionsForParam = (line, command) => {
  const isAppCommand = appCommands.some(appCommand => appCommand === command);
  if (isAppCommand) {
    return prefixCompletions(appNames, command);
  }
  const isGroupCommand = groupCommands.some(groupCommand => groupCommand === command);
  if (isGroupCommand) {
    return prefixCompletions(groupNames, command);
  }
  return [];
};

module.exports = (line) => {
  const command = line.split(' ')[0];
  const completions = line.includes(' ') ? getCompletionsForParam(line, command) : commandNames;
  const hits = completions.filter(c => c.startsWith(line));
  return [hits.length ? hits : completions, line];
};
