const childProcess = require('child_process');
const { expect } = require('chai');
const sinon = require('sinon');
const { startApp, startProfile } = require('./../src/processes');
const repository = require('./../src/repository');
const profile = require('./../src/profile');
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

const unknownAppProfile = {
  name: 'knownProfile',
  apps: ['unknownApp'],
};

const knownProfile = {
  name: 'knownProfile',
  apps: [''],
};


describe('processes', () => {
  before(() => {
    sinon.stub(logger, 'info');
    sinon.stub(childProcess, 'spawn').returns(fakeChildProcess);
    sinon.stub(repository, 'getAppByName');
    sinon.stub(profile, 'getProfileByName');
    repository.getAppByName.withArgs('knownApp').returns(knownApp);
    repository.getAppByName.withArgs('unknownApp').returns(undefined);
    profile.getProfileByName.withArgs('knownProfile').returns(knownProfile);
    profile.getProfileByName.withArgs('unknownProfile').returns(undefined);
    profile.getProfileByName.withArgs('unknownApp').returns(unknownAppProfile);
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
        expect(logger.info.args[0]).to.be.deep.equal(['App unknownApp not found.']);
      });
    });
  });

  describe('#startProfile', () => {
    describe('When starting known profile', () => {
      before(() => {
        startProfile('knownProfile');
      });

      it('should start known profile with existing apps inside', () => {
        expect(logger.info.args[logger.info.args.length - 1]).to.be.deep.equal(['Finished with starting the profile']);
      });
    });

    describe('When starting unknown profile', () => {
      before(() => {
        startProfile('unknownProfile');
      });

      it('should give user hint about unknown profile', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.be.deep.equal(['Profile unknownProfile not found.']);
      });
    });

    describe('When starting profile with unkown app', () => {
      before(() => {
        startProfile('unknownApp');
      });

      it('should give user hint about unknown app inside the defined profile', () => {
        expect(logger.info.args[logger.info.args.length - 2]).to.be.deep.equal(['App unknownApp not found.']);
      });
    });
  });

  afterEach(() => {
    logger.info.resetHistory();
    childProcess.spawn.resetHistory();
    repository.getAppByName.resetHistory();
    profile.getProfileByName.resetHistory();
  });

  after(() => {
    logger.info.restore();
    childProcess.spawn.restore();
    repository.getAppByName.restore();
    profile.getProfileByName.restore();
  });
});
