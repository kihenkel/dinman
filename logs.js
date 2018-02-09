const logs = {};

const handleOnData = (app, data) => {
  if (!logs[app]) {
    logs[app] = '';
  }
  logs[app] += data;
};

const showLog = (app) => {
  if (!logs[app]) {
    console.log(`No logs found for ${app}.`)
    return false;
  }
  process.stdout.write('\u001B[2J\u001B[0;0f');
  console.log(logs[app])
  return true;
};

module.exports = {
  onData: handleOnData,
  showLog,
};