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
const completer = require('./src/completer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer,
});

const arguments = process.argv.slice(2);
if (arguments && arguments.length) {
  logger.info(`Starting with groups ${arguments}`);
  arguments.forEach(argument => commands.run('start-group', argument));
}

rl.on('line', (input) => {
  [command, ...args] = input.split(' ');
  commands.run(command, ...args);
  process.stdout.write('\> ');
});

process.stdout.write('\> ');