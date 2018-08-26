const path = require('path');

const mapDetectedApp = (detectedApp) => {
  const { name, entry } = detectedApp;
  return {
    name,
    type: name.slice(name.lastIndexOf('-') + 1),
    path: detectedApp.path,
    entry,
    dependencies: detectedApp.dependencies.map(dependency => dependency.name),
  };
};

module.exports = (detectedApps, buildPaths) => {
  const dinmanConfig = {
    apps: detectedApps.map(mapDetectedApp),
    buildPaths: buildPaths && buildPaths.map(buildPath => path.normalize(buildPath)),
  };

  return JSON.stringify(dinmanConfig, null, ' ');
};
