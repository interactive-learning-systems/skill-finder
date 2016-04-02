(function () {
  'use strict';

  angular
    .module('performances.services')
    .factory('PerformancesService', PerformancesService);

  PerformancesService.$inject = ['$resource'];

  function PerformancesService($resource) {
    return $resource('api/performances/:performanceId', {
      performanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
