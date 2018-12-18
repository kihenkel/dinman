/* eslint-disable global-require */
const readline = require('readline');

const argumentMatch = /("[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|\/[^/\\]*(?:\\[\S\s][^/\\]*)*\/[gimy]*(?=\s|$)|(?:\\\s|\S)+)/g;

const parseInput = input =>
  input.match(argumentMatch);

let promptInternal = () => {
  throw new Error('Prompt not yet initialized, call listen() first!');
};

let pauseInternal = () => {
  throw new Error('Pause not yet initialized, call listen() first!');
};

let resumeInternal = () => {
  throw new Error('Resume not yet initialized, call listen() first!');
};

const prompt = () => promptInternal();
const pause = () => pauseInternal();
const resume = () => resumeInternal();

const listen = () => {
  const commands = require('./commands');
  const completer = require('./completer');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  });

  promptInternal = () => {
    rl.prompt(true);
  };

  pauseInternal = () => {
    rl.pause();
  };

  resumeInternal = () => {
    rl.resume();
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
  pause,
  resume,
};
