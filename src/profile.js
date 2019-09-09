const { getConfig } = require('./config');

let profiles;
let profileNames;
const init = () => {
  profiles = (getConfig().profiles || []);
  profileNames = profiles.map(profile => profile.name);
};

init();

const getProfileNames = () => profileNames;
const getProfiles = () => profiles;
const getProfileByName = profileName => profiles.find(profile => profile.name === profileName);

module.exports = {
  getProfileNames,
  getProfiles,
  getProfileByName,
  reload: init,
};
