const logger = require('./src/logger');

require('./validateConfig')()
  .catch(error => {
    logger.info('');
    logger.error(error);
    process.exit(1);
  });

const input = require('./src/input');
const commands = require('./src/commands');

const { name, version } = require('./package.json');
logger.info(`\n${name} ${version}`);

const arguments = process.argv.slice(2);
if (arguments && arguments.length) {
  logger.info(`Starting with groups ${arguments}`);
  arguments.forEach(argument => commands.run('start-group', argument));
}

input.listen();