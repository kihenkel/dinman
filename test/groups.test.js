const { expect } = require('chai');
const sinon = require('sinon');
const { startGroup } = require('./../src/groups');
const logger = require('./../src/logger');

describe('groups', () => {
  before(() => {
    sinon.stub(logger, 'info');
  });

  afterEach(() => {
    logger.info.resetHistory();
  });

  after(() => {
    logger.info.restore();
  });
  describe('#startGroup', () => {
    describe('When starting unknown group', () => {
      before(() => {
        startGroup('SOME_UNKNOWN_GROUP');
      });

      it('should give user hint about unknown group', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.be.deep.equal(['Group SOME_UNKNOWN_GROUP not found.']);
      });
    });
  });
});