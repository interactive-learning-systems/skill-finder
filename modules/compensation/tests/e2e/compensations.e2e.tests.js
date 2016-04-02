'use strict';

describe('Compensations E2E Tests:', function () {
  describe('Test compensations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/compensations');
      expect(element.all(by.repeater('compensation in compensations')).count()).toEqual(0);
    });
  });
});
