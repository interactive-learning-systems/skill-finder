'use strict';

describe('Performances E2E Tests:', function () {
  describe('Test performances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/performances');
      expect(element.all(by.repeater('performance in performances')).count()).toEqual(0);
    });
  });
});
