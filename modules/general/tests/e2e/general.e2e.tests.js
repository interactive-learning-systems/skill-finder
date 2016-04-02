'use strict';

describe('Generals E2E Tests:', function () {
  describe('Test generals page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/generals');
      expect(element.all(by.repeater('general in generals')).count()).toEqual(0);
    });
  });
});
