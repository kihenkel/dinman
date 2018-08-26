const { getConfig } = require('./config');

let apps;
let appNames;
const init = () => {
  apps = getConfig().apps || [];
  appNames = apps.map(app => app.name);
};

init();

const getAppNames = () => appNames;
const getApps = () => apps;
const getAppByName = appName => apps.find(app => app.name === appName);

module.exports = {
  getAppNames,
  getApps,
  getAppByName,
  reload: init,
};
