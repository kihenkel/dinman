const mapDetectedApp = (detectedApp) => {
  const { name, path, entry } = detectedApp;
  return {
    name,
    type: name.slice(name.lastIndexOf('-') + 1),
    path,
    entry,
    dependencies: detectedApp.dependencies.map(dependency => dependency.name),
  };
};

module.exports = (detectedApps) => {
  const dinmanConfig = {
    apps: detectedApps.map(mapDetectedApp),
  };

  return JSON.stringify(dinmanConfig, null, ' ');
};
