const readline = require('readline');
const completer = require('./completer');
const commands = require('./commands');

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
    [command, ...args] = input.split(' ');
    await commands.run(command, ...args);
    prompt();
  });
  
  prompt();
};

module.exports = {
  listen,
  prompt,
};