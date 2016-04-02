(function () {
  'use strict';

  angular
    .module('trainings.services')
    .factory('TrainingsService', TrainingsService);

  TrainingsService.$inject = ['$resource'];

  function TrainingsService($resource) {
    return $resource('api/trainings/:trainingId', {
      trainingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
