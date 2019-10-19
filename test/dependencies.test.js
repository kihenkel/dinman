const { expect } = require('chai');
const sinon = require('sinon');
const { startApp, startProfile } = require('./../src/dependencies');
const logger = require('./../src/logger');
const repository = require('./../src/repository');
const processes = require('./../src/processes');
const profile = require('../src/profile');

const testApp = {
  name: 'knownApp',
  dependencies: ['dependency1', 'dependency2', 'dependency3'],
};

describe('dependencies', () => {
  before(() => {
    sinon.stub(logger, 'info');
    sinon.stub(processes, 'startApp');
  });

  afterEach(() => {
    logger.info.resetHistory();
    processes.startApp.resetHistory();
  });

  after(() => {
    logger.info.restore();
    processes.startApp.restore();
  });

  describe('#startApp', () => {
    let inputCommand;

    describe('When providing unknown app name', () => {
      before(() => {
        startApp('UNKNOWN_APP_NAME');
      });

      it('should give user hint about unknown app name', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.be.deep.equal(['App UNKNOWN_APP_NAME not found.']);
      });
    });

    describe('When app with dependencies should start', () => {
      const knownApp = {
        name: 'knownApp',
        dependencies: ['dependency1', 'dependency2', 'dependency3'],
      };
      const dependency1 = { name: 'dependency1', dependencies: ['dependency3'] };
      const dependency2 = { name: 'dependency2', dependencies: ['dependency2'] };
      const dependency3 = { name: 'dependency3', dependencies: ['dependency1'] };

      before(() => {
        sinon.stub(repository, 'getAppByName');
        repository.getAppByName.withArgs('knownApp').returns(knownApp);
        repository.getAppByName.withArgs('dependency1').returns(dependency1);
        repository.getAppByName.withArgs('dependency2').returns(dependency2);
        repository.getAppByName.withArgs('dependency3').returns(dependency3);
        startApp('knownApp');
      });

      afterEach(() => {
        repository.getAppByName.resetHistory();
      });

      after(() => {
        repository.getAppByName.restore();
      });

      it('should start 4 apps (without an infinite loop)', () => {
        expect(processes.startApp.callCount).to.equal(4);
        expect(processes.startApp.args[0]).to.deep.equal(['dependency3']);
        expect(processes.startApp.args[1]).to.deep.equal(['dependency1']);
        expect(processes.startApp.args[2]).to.deep.equal(['dependency2']);
        expect(processes.startApp.args[3]).to.deep.equal(['knownApp']);
      });
    });

    describe('When app should start that has itself as dependency', () => {
      const knownApp = {
        name: 'knownApp',
        dependencies: ['knownApp', 'otherApp'],
      };
      const otherApp = {
        name: 'otherApp',
        dependencies: [],
      };
      before(() => {
        sinon.stub(repository, 'getAppByName');
        repository.getAppByName.withArgs('knownApp').returns(knownApp);
        repository.getAppByName.withArgs('otherApp').returns(otherApp);
        startApp('knownApp');
      });

      afterEach(() => {
        repository.getAppByName.resetHistory();
      });

      after(() => {
        repository.getAppByName.restore();
      });

      it('should normally start 2 apps (without an infinite loop)', () => {
        expect(processes.startApp.callCount).to.equal(2);
        expect(processes.startApp.args[0]).to.deep.equal(['otherApp']);
        expect(processes.startApp.args[1]).to.deep.equal(['knownApp']);
      });
    });
  });

  describe('#startProfile', () => {
    describe('When starting known profile', () => {
      const knownProfile = {
        name: 'knownProfile',
        apps: ['app1', 'app2', 'app3'],
      };
      const app1 = { name: 'app1', dependencies: [] };
      const app2 = { name: 'app2', dependencies: [] };
      const app3 = { name: 'app3', dependencies: [] };

      before(() => {
        sinon.stub(profile, 'getProfileByName');
        sinon.stub(repository, 'getAppByName');
        profile.getProfileByName.withArgs('knownProfile').returns(knownProfile);
        repository.getAppByName.withArgs('app1').returns(app1);
        repository.getAppByName.withArgs('app2').returns(app2);
        repository.getAppByName.withArgs('app3').returns(app3);
        startProfile('knownProfile');
      });

      afterEach(() => {
        profile.getProfileByName.resetHistory();
        repository.getAppByName.resetHistory();
      });

      after(() => {
        profile.getProfileByName.restore();
        repository.getAppByName.restore();
      });

      it('should start 3 apps', () => {
        expect(processes.startApp.callCount).to.equal(3);
        expect(processes.startApp.args[0]).to.deep.equal(['app1']);
        expect(processes.startApp.args[1]).to.deep.equal(['app2']);
        expect(processes.startApp.args[2]).to.deep.equal(['app3']);
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
    describe('When starting profile with unknown apps', () => {
      const knownProfile = {
        name: 'knownProfile',
        apps: ['app1', 'app2', 'app3'],
      };

      const app1 = { name: 'app1', dependencies: [] };
      const app2 = { name: 'app2', dependencies: [] };

      before(() => {
        sinon.stub(profile, 'getProfileByName');
        sinon.stub(repository, 'getAppByName');
        profile.getProfileByName.withArgs('knownProfile').returns(knownProfile);
        repository.getAppByName.withArgs('app1').returns(app1);
        repository.getAppByName.withArgs('app2').returns(app2);
        startProfile('knownProfile');
      });

      afterEach(() => {
        profile.getProfileByName.resetHistory();
        repository.getAppByName.resetHistory();
      });

      after(() => {
        profile.getProfileByName.restore();
        repository.getAppByName.restore();
      });

      it('should start 2 apps and informate that one app was not found', () => {
        expect(processes.startApp.callCount).to.equal(2);
        expect(processes.startApp.args[0]).to.deep.equal(['app1']);
        expect(processes.startApp.args[1]).to.deep.equal(['app2']);
        expect(logger.info.args[2]).to.deep.equal(['App app3 not found.']);
      });
    });
  });
});
