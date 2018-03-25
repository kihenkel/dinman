const fs = require('fs');
const path = require('path');
const defaults = require('./src/defaults');
const logger = require('./src/logger');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      require.resolve('./config.json');
    } catch (err) {
      logger.error('Error resolving config. Did you run config builder?');
      logger.error('=> npm run buildconfig -- "/some/path/to/apps" "/some/other/path/to/apps"');
      return resolve();
    }

    const config = require('./config.json');
    const apps = config.apps;
    const groups = config.groups;

    if (!apps || !apps.length) {
      logger.error('No apps defined in config!');
      return resolve();
    }

    apps.forEach(project => {
      if (!project.name) {
        return reject('Not all apps have a name');
      }

      if (!project.path) {
        return reject('Not all apps have a path');
      }
    });

    if (groups) {
      Object.entries(groups).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          return reject(`Group ${key} is not an array`);
        }
      });
    }

    return Promise.all(apps.map(project => {
      const entry = project.entry || path.join(project.path, defaults.PROJECT_ENTRY);
      try {
        fs.statSync(entry);
        return resolve();
      } catch (error) {
        logger.warning(`Couldn't find entry ${entry} for ${project.name}! Starting app won't work.`);
        return resolve();
      }
    }))
  });
};