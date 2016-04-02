'use strict';

describe('Reports E2E Tests:', function () {
  describe('Test reports page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reports');
      expect(element.all(by.repeater('reports in reports')).count()).toEqual(0);
    });
  });
});
