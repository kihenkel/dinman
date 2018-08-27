// This is used for communication with parent process
// if config is being rebuilt via dinman itself

const announceSuccess = () => {
  if (process.send) {
    process.send({ result: 'OK' });
  }
};

const announceError = () => {
  if (process.send) {
    process.send({ result: 'NOK' });
  }
};

module.exports = {
  announceSuccess,
  announceError,
};
