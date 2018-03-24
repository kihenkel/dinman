const { expect } = require('chai');
const sinon = require('sinon');
const { run } = require('./../src/commands');
const logger = require('./../src/logger');

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
        expect(logger.info.args[0]).to.be.deep.equal(['Unknown command SOME_UNKNOWN_COMMAND']);
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
  });
});