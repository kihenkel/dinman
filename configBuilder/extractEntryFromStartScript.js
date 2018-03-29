module.exports = (scripts) => {
  if (!scripts || !scripts.start) {
    return undefined;
  }
  const matches = scripts.start.match(/node (.+)/);
  return matches && matches[1];
};
