const fs = require('fs');
const path = require('path');
const defaults = require('./src/defaults');
const logger = require('./src/logger');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      require.resolve('./config.json');
    } catch (err) {
      return reject('Error resolving config. Did you run config builder?');
    }

    const { apps, groups } = require('./config.json');
    if (!apps) {
      return reject('No apps defined');
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
      const entry = path.join(project.path, project.entry || defaults.PROJECT_ENTRY);
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