const repository = require('./repository');
const processes = require('./processes');

const startApp = (appName) => {
  const app = repository.getAppByName(appName);
  app.dependencies.forEach(dependencyAppName => {
    processes.startApp(dependencyAppName);
  });
  processes.startApp(appName);
}

module.exports = {
  startApp,
};