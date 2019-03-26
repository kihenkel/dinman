const { getConfig } = require('./config');

let apps;
let appNames;
const init = () => {
  const sortByAppName = (a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  };

  apps = (getConfig().apps || []).sort(sortByAppName);
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
