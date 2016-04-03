(function () {
  'use strict';

  angular
    .module('compensations.services')
    .factory('CompensationsService', CompensationsService);

  CompensationsService.$inject = ['$resource'];

  function CompensationsService($resource) {
    return $resource('api/compensations/:compensationId', {
      compensationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
