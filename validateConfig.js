const fs = require('fs');
const defaults = require('./src/defaults');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      require.resolve('./config/config.json');
    } catch (err) {
      logger.error('Error resolving config. Did you add config/config.json?');
      return;
    }
    const { apps, groups } = require('./config/config.json');

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
      return fs.access(`${project.path}/${project.entry || defaults.PROJECT_ENTRY}`, (error) => {
        if (error) {
          return reject(error);
        }
        return resolve();
      });
    }))
  });
};