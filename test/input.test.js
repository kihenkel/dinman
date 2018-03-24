const { expect } = require('chai');
const sinon = require('sinon');
const { parseInput } = require('./../src/input');

describe('input', () => {
  describe('#parseInput', () => {
    describe('When passing complicated input', () => {
      let result;
      before(() => {
        result = parseInput(`this 'is some' "complicated input" *with number* 12345 and -some --params`);
      });

      it('should parse to correct params', () => {
        expect(result).to.deep.equal(['this', `'is some'`, `"complicated input"`, '*with', 'number*', '12345', 'and', '-some', '--params']);
      });
    });
  });
});