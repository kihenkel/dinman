const logger = require('./../src/logger');

const lookupAppForPort = (port, detectedApps) => detectedApps.find(app => app.port === port);

const hasCircularDependency = (appA, appB) => appA.dependencies.includes(appB) ||
    appB.dependencies.includes(appA);

const flattenObject = (obj, flattened) => {
  const values = Object.values(obj);

  return values.reduce((acc, val) => {
    if (val && typeof val === 'object') {
      return flattenObject(val, acc);
    }
    return acc.concat(val);
  }, flattened);
};

module.exports = (config, app, detectedApps) => {
  if (!config) {
    logger.verbose(`Skipping config for app ${app.name} because config doesnt exist.`);
    return;
  }

  const flattenedConfig = flattenObject(config, []);

  flattenedConfig.forEach((configValue) => {
    if (typeof configValue !== 'string') {
      logger.verbose(`Skipping ${configValue} for app ${app.name} because ${configValue} is not string but ${typeof configValue}`);
      return;
    }
    const match = configValue.match(/(?:localhost|127\.0\.0\.1):(\d+)/);
    if (!match || match.length !== 2) {
      logger.verbose(`Skipping ${configValue} for app ${app.name} because ${configValue} doesnt contain port.`);
      return;
    }
    const port = parseInt(match[1], 10);
    const lookupApp = lookupAppForPort(port, detectedApps);
    if (!lookupApp) {
      logger.verbose(`Skipping ${configValue} for app ${app.name} because couldn't find app for port ${port}.`);
      return;
    }

    if (app.name === lookupApp.name) {
      logger.verbose(`${app.name} has itself as a dependency, ignoring ...`);
      return;
    }

    if (hasCircularDependency(app, lookupApp)) {
      logger.warning(`Circular dependency found for app ${app.name} and ${lookupApp.name}!`);
    }

    if (!app.dependencies.includes(lookupApp)) {
      logger.info(`${app.name}: Adding ${lookupApp.name} as dependency.`);
      app.dependencies.push(lookupApp);
    }
  });
};
