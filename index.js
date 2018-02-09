const logger = require('./src/logger');

require('./validateConfig')()
  .catch(error => {
    logger.info('');
    logger.error(error);
    process.exit(1);
  });

const { spawn } = require('child_process');
const readline = require('readline');
const repository = require('./src/repository');
const commands = require('./src/commands');
const processes = require('./src/processes');

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