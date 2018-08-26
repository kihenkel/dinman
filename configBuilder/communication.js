// This is used for communication with parent process
// if config is being rebuilt via dinman itself

const announceSuccess = () => {
  process.send({ result: 'OK' });
};

const announceError = () => {
  process.send({ result: 'NOK' });
};

module.exports = {
  announceSuccess,
  announceError,
};
