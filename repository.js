const { projects } = require('./config');

const apps = projects.map(app => Object.assign(app, { }));

const getAppNames = () =>
  apps.map(app => app.name);

const getAppStats = () =>
  apps.map(app => ({
    name: app.name,
    running: app.running,
  }));

const getApps = () => apps;

const getAppByName = (appName) => apps.find(app => app.name === appName);

module.exports = {
  getAppNames,
  getApps,
  getAppStats,
  getAppByName,
};