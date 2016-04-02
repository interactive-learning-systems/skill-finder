'use strict';

describe('Hires E2E Tests:', function () {
  describe('Test hires page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hires');
      expect(element.all(by.repeater('hire in hires')).count()).toEqual(0);
    });
  });
});
