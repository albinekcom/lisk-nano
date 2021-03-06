import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getForgedBlocks, getForgedStats } from './forging';

chai.use(sinonChai);


describe('Utils: Forging', () => {
  describe('getForgedBlocks', () => {
    it('should return a promise', () => {
      const promise = getForgedBlocks();
      expect(typeof promise.then).to.be.equal('function');
    });
  });

  describe('getForgedStats', () => {
    it('should return a promise', () => {
      const promise = getForgedStats();
      expect(typeof promise.then).to.be.equal('function');
    });
  });
});
