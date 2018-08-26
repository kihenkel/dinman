const logger = require('./src/logger');
const commands = require('./src/commands');
const { name, version } = require('./package.json');
logger.info(`\n${name} ${version}`);

require('./validateConfig')()
  .then(() => {
    const input = require('./src/input');    
    input.listen();
  })
  .catch(error => {
    logger.info('');
    logger.error(error);
    process.exit(1);
  });