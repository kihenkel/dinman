let dependencyConfig;
try {
  require.resolve('./../dependencyConfig.json');
  dependencyConfig = require('./../dependencyConfig.json');
} catch (error) {
  dependencyConfig = {};
}

const looseDependencyTypes = dependencyConfig.looseDependencyTypes || [];
const repository = require('./repository');
const processes = require('./processes');
const logger = require('./logger');

const isLooseDependency = (app, dependencyApp) =>
  looseDependencyTypes.some(looseDependencyType =>
    app.type === looseDependencyType.from && 
      dependencyApp.type === looseDependencyType.to
  );

const _startAppWithDependencies = (app, appsToStart) => {
  appsToStart.push(app.name);
  app.dependencies.forEach(dependencyAppName => {
    if (appsToStart.includes(dependencyAppName)) {
      return;
    }
    const dependencyApp = repository.getAppByName(dependencyAppName);
    if (isLooseDependency(app, dependencyApp)) {
      return;
    }
    _startAppWithDependencies(dependencyApp, appsToStart);
  });
  processes.startApp(app.name);
};

const startApp = (appName) => {
  const app = repository.getAppByName(appName);

  if (!app) {
    logger.info(`App ${appName} not found.`);
    return;
  }

  _startAppWithDependencies(app, []);
}

module.exports = {
  startApp,
};