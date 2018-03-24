const readline = require('readline');
const completer = require('./completer');
const commands = require('./commands');

const argumentMatch = /("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g;

const parseInput = input =>
  input.match(argumentMatch);

let promptInternal = () => {
  throw new Error('Prompt not yet initialized, call listen() first!');
};

const prompt = () => {
  promptInternal();
};

const listen = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  });

  promptInternal = () => {
    rl.prompt();
  };

  rl.on('line', async (input) => {
    if (input) {
      const [command, ...args] = parseInput(input);
      await commands.run(command, ...args);
    }
    prompt();
  });

  prompt();
};

module.exports = {
  listen,
  prompt,
  parseInput,
};
