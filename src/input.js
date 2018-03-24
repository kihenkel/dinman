const readline = require('readline');
const completer = require('./completer');
const commands = require('./commands');

const argumentMatch = /("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer,
});

const prompt = () => {
  rl.prompt();
};

const listen = () => {
  rl.on('line', async (input) => {
    if (input) {
      const [command, ...args] = input.match(argumentMatch);
      await commands.run(command, ...args);
    }
    prompt();
  });

  prompt();
};

module.exports = {
  listen,
  prompt,
};
