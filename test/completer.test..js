const { expect } = require('chai');
const sinon = require('sinon');
const completer = require('./../src/completer');

describe('completer', () => {
  describe('When typing in line sta', () => {
    let result;
    before(() => {
      result = completer('sta');
    });

    it('should return start commands as suggestion', () => {
      expect(result).to.deep.equal([[
        'start',
        'start-excluded',
        'start-only',
        'start-all',
        'start-group',
      ], 'sta']);
    });
  });

  describe('When typing in line sto', () => {
    let result;
    before(() => {
      result = completer('sto');
    });

    it('should return stop commands as suggestion', () => {
      expect(result).to.deep.equal([['stop', 'stop-all', 'stop-group'], 'sto']);
    });
  });
});