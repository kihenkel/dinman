const childProcess = require('child_process');
const { expect } = require('chai');
const sinon = require('sinon');
const { startApp } = require('./../src/processes');
const repository = require('./../src/repository');
const logger = require('./../src/logger');

const fakeChildProcess = {
  on: () => {},
  stdout: { on: () => {} },
  stderr: { on: () => {} },
};

const knownApp = {
  name: 'knownApp',
  path: 'some/path/to/application',
  entry: 'some/path/to/application/index.js',
};

describe('processes', () => {
  before(() => {
    sinon.stub(logger, 'info');
    sinon.stub(childProcess, 'spawn').returns(fakeChildProcess);
    sinon.stub(repository, 'getAppByName');
    repository.getAppByName.withArgs('knownApp').returns(knownApp);
    repository.getAppByName.withArgs('unknownApp').returns(undefined);
  });

  afterEach(() => {
    logger.info.resetHistory();
    childProcess.spawn.resetHistory();
    repository.getAppByName.resetHistory();
  });

  after(() => {
    logger.info.restore();
    childProcess.spawn.restore();
    repository.getAppByName.restore();
  });

  describe('#startApp', () => {
    describe('When starting known app', () => {
      let resultProcess;
      before(() => {
        resultProcess = startApp('knownApp');
      });

      it('should have spawned child process', () => {
        expect(childProcess.spawn.calledOnce).to.be.true;
        expect(childProcess.spawn.args[0]).to.deep.equal([
          'node',
          ['some/path/to/application/index.js'],
          { cwd: 'some/path/to/application' },
        ]);
      });

      it('should return correct process', () => {
        expect(resultProcess).to.equal(fakeChildProcess);
      });

      describe('When starting known app AGAIN', () => {
        beforeEach(() => {
          startApp('knownApp');
        });

        it('should not spawn child process', () => {
          expect(childProcess.spawn.called).to.be.false;
        });
  
        it('should give user hint that app is already running', () => {
          expect(logger.info.callCount).to.equal(1);
          expect(logger.info.args[0]).to.be.deep.equal(['App knownApp is already running!']);
        });
      });
    });

    describe('When starting unknown app', () => {
      before(() => {
        startApp('unknownApp');
      });

      it('should give user hint about unknown app', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.be.deep.equal(['App unknownApp not found.']);
      });
    });
  });
});