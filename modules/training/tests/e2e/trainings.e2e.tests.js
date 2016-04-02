'use strict';

describe('Trainings E2E Tests:', function () {
  describe('Test trainings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trainings');
      expect(element.all(by.repeater('training in trainings')).count()).toEqual(0);
    });
  });
});
