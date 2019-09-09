const childProcess = require('child_process');
const { expect } = require('chai');
const sinon = require('sinon');
const { sanitizeCommand, cmd } = require('./../src/cmd');
const logger = require('./../src/logger');

describe('cmd', () => {
  describe('#sanitizeCommand', () => {
    let inputCommand;

    describe('When command does not start with quotes', () => {
      before(() => {
        inputCommand = 'this is some command';
      });

      it('should sanitize double quotes', () => {
        expect(sanitizeCommand(inputCommand)).to.equal('this is some command');
      });
    });

    describe('When command starts and ends with double quotes', () => {
      before(() => {
        inputCommand = '"this is some command"';
      });

      it('should sanitize double quotes', () => {
        expect(sanitizeCommand(inputCommand)).to.equal('this is some command');
      });
    });

    describe('When command starts and ends with single quotes', () => {
      before(() => {
        inputCommand = '\'this is some command\'';
      });

      it('should sanitize double quotes', () => {
        expect(sanitizeCommand(inputCommand)).to.equal('this is some command');
      });
    });
  });

  describe('#cmd', () => {
    before(() => {
      sinon.stub(logger, 'info');
      sinon.stub(childProcess, 'exec');
    });

    afterEach(() => {
      logger.info.resetHistory();
      childProcess.exec.resetHistory();
    });

    after(() => {
      logger.info.restore();
      childProcess.exec.restore();
    });

    describe('When no argument is provided', () => {
      before(() => {
        cmd();
      });

      it('should give user hint message', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.deep.equal(['Please provide app and command.']);
      });

      it('should not call exec', () => {
        expect(childProcess.exec.called).to.be.false;
      });
    });

    describe('When one argument is provided', () => {
      before(() => {
        cmd('something');
      });

      it('should give user hint message', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.deep.equal(['Please provide app and command.']);
      });

      it('should not call exec', () => {
        expect(childProcess.exec.called).to.be.false;
      });
    });

    describe('When app is unknown', () => {
      before(() => {
        cmd('SOME_UNKNOWN_APP_NAME', 'some command');
      });

      it('should give user hint message', () => {
        expect(logger.info.calledOnce).to.be.true;
        expect(logger.info.args[0]).to.deep.equal(['App SOME_UNKNOWN_APP_NAME not found.']);
      });

      it('should not call exec', () => {
        expect(childProcess.exec.called).to.be.false;
      });
    });
  });
});
