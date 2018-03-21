let dependencyConfig = {};
if (require.resolve('./../config/dependencyConfig.json')) {
  dependencyConfig = require('./../config/dependencyConfig.json');
}
const looseDependencyTypes = dependencyConfig.looseDependencyTypes || [];
const repository = require('./repository');
const processes = require('./processes');

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
  _startAppWithDependencies(app, []);
}

module.exports = {
  startApp,
};