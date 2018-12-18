const { expect } = require('chai');
const sinon = require('sinon');
const { run } = require('./../src/commands');
const logger = require('./../src/logger');
const repository = require('./../src/repository');

describe('commands', () => {
  before(() => {
    sinon.stub(logger, 'info');
  });

  afterEach(() => {
    logger.info.resetHistory();
  });

  after(() => {
    logger.info.restore();
  });
  describe('#run', () => {
    describe('When running unknown command', () => {
      before(() => {
        run('SOME_UNKNOWN_COMMAND');
      });

      it('should give user hint about unknown command', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.be.deep.equal(['Unknown command SOME_UNKNOWN_COMMAND.']);
      });
    });

    describe('When running help command', () => {
      before(() => {
        run('help');
      });

      it('should output correct amount of commands', () => {
        expect(logger.info.callCount).to.equal(12 + 1);
      });
    });

    describe('When running ls command', () => {
      let getAppsStub;
      before(() => {
        getAppsStub = sinon.stub(repository, 'getApps');
        sinon.stub(logger, 'negative');
      });
      
      afterEach(() => {
        repository.getApps.resetHistory();
        logger.negative.resetHistory();
      });
    
      after(() => {
        repository.getApps.restore();
        logger.negative.restore();
      });

      describe('and 4 apps are registered', () => {
        beforeEach(() => {
          getAppsStub.returns([
            { name: 'app1' },
            { name: 'app2' },
            { name: 'app3' },
            { name: 'app4' },
          ]);
          run('ls');
        });
  
        it('should list all apps', () => {
          expect(logger.info.callCount).to.equal(0);
          expect(logger.negative.callCount).to.equal(4);
          expect(logger.negative.args[0][1]).to.equal('app1');
          expect(logger.negative.args[1][1]).to.equal('app2');
          expect(logger.negative.args[2][1]).to.equal('app3');
          expect(logger.negative.args[3][1]).to.equal('app4');
        });
      });

      describe('and no apps are registered', () => {
        beforeEach(() => {
          getAppsStub.returns([]);
          run('ls');
        });
  
        it('should tell user that no apps are found', () => {
          expect(logger.info.calledOnce).to.be.true;
          expect(logger.info.args[0]).to.be.deep.equal(['No apps registered.']);
        });
      });
    });
  });
});