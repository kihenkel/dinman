const { apps } = require('./../config');

const getAppNames = () =>
  apps.map(app => app.name);
const getApps = () => apps;
const getAppByName = (appName) => apps.find(app => app.name === appName);

module.exports = {
  getAppNames,
  getApps,
  getAppByName,
};