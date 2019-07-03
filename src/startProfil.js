const { getConfig } = require('./config');

let profils;
let profilNames;
const init = () => {
  const sortByAppName = (a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  };

  profils = (getConfig().profils || []).sort(sortByAppName);
  profilNames = profils.map(profil => profil.name);
};

init();

const getProfilNames = () => profilNames;
const getProfils = () => profils;
const getProfilByName = profilName => profils.find(profil => profil.name === profilName);

module.exports = {
  getProfilNames,
  getProfils,
  getProfilByName,
  reload: init,
};
