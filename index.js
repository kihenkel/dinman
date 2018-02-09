const { spawn } = require('child_process');
const readline = require('readline');
const repository = require('./repository');
const commands = require('./commands');
const processes = require('./processes');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  [command, ...args] = input.split(' ');
  commands.run(command, ...args);
  process.stdout.write('\> ');
});

process.stdout.write('\> ');